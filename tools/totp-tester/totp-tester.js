(() => {
  "use strict";

  const STORAGE_KEY = "masoomdev.totpTester.accounts.v1";
  const BACKUP_TYPE = "masoomdev-totp-backup";
  const BACKUP_VERSION = 1;
  const PBKDF2_ITERATIONS = 310000;
  const MAX_ACCOUNTS = 100;
  const $ = (id) => document.getElementById(id);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let accounts = [];
  let refreshing = false;
  const accountNodes = new Map();

  function setStatus(element, message, state = "") {
    element.textContent = message;
    if (state) element.dataset.state = state;
    else delete element.dataset.state;
  }

  function normalizeSecret(value) {
    return value.toUpperCase().replace(/[\s-]/g, "").replace(/=+$/g, "");
  }

  function decodeBase32(value) {
    const secret = normalizeSecret(value);
    if (!secret || !/^[A-Z2-7]+$/.test(secret)) {
      throw new Error("Enter a valid Base32 secret using letters A–Z and digits 2–7.");
    }
    const output = new Uint8Array(Math.floor((secret.length * 5) / 8));
    let buffer = 0;
    let bits = 0;
    let offset = 0;
    for (const character of secret) {
      const code = character.charCodeAt(0);
      const value = code >= 65 && code <= 90 ? code - 65 : code - 24;
      buffer = (buffer << 5) | value;
      bits += 5;
      if (bits >= 8) {
        bits -= 8;
        output[offset++] = (buffer >>> bits) & 255;
      }
    }
    if (output.length < 10) throw new Error("The Base32 secret is too short.");
    return output;
  }

  function validateEntry(candidate) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      throw new Error("Backup contains an invalid account.");
    }
    const { id, service, account, secret, algorithm, digits, period } = candidate;
    if (typeof id !== "string" || !id || id.length > 100 || typeof service !== "string" || !service.trim() || service.length > 80 || typeof account !== "string" || account.length > 100 || typeof secret !== "string" || secret.length > 200) {
      throw new Error("Backup contains an invalid account.");
    }
    if (!["SHA-1", "SHA-256", "SHA-512"].includes(algorithm) || ![6, 8].includes(digits) || ![30, 60].includes(period)) {
      throw new Error("Backup contains unsupported TOTP settings.");
    }
    const normalizedSecret = normalizeSecret(secret);
    decodeBase32(normalizedSecret);
    return {
      id,
      service: service.trim(),
      account: account.trim(),
      secret: normalizedSecret,
      algorithm,
      digits,
      period,
    };
  }

  function saveAccounts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
      setStatus($("autosave-status"), "Changes saved automatically in this browser.", "success");
      return true;
    } catch {
      setStatus($("autosave-status"), "Browser storage is unavailable. Your latest changes may not survive a refresh.", "error");
      return false;
    }
  }

  function loadAccounts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length > MAX_ACCOUNTS) throw new Error();
      accounts = parsed.map(validateEntry);
    } catch {
      accounts = [];
      setStatus($("autosave-status"), "Saved data could not be read. It has not been overwritten.", "error");
    }
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createAccountCard(record) {
    const card = makeElement("article", "account-card");
    const top = makeElement("div", "account-top");
    const titleBlock = makeElement("div", "account-title");
    const title = makeElement("h3", "", record.service);
    const subtitle = makeElement("p", "account-subtitle", record.account || "Authenticator account");
    const settings = makeElement("p", "account-settings", `${record.algorithm} · ${record.digits} digits · ${record.period}s`);
    const actions = makeElement("div", "account-actions");
    const codeRow = makeElement("div", "code-row");
    const code = makeElement("output", "code-value", "••••••");
    code.setAttribute("aria-label", `Current ${record.digits}-digit code for ${record.service}`);
    const copy = makeElement("button", "icon-button copy-code", "Copy code");
    copy.type = "button";
    copy.setAttribute("aria-label", `Copy current code for ${record.service}`);
    copy.addEventListener("click", async () => {
      if (!code.dataset.currentCode) return;
      try {
        await navigator.clipboard.writeText(code.dataset.currentCode);
        setStatus($("entry-status"), `Code copied for ${record.service}.`, "success");
      } catch {
        setStatus($("entry-status"), "Clipboard access is unavailable in this browser.", "error");
      }
    });
    const remove = makeElement("button", "icon-button danger", "Remove");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${record.service}`);
    remove.addEventListener("click", () => {
      if (!window.confirm(`Remove the saved TOTP account for ${record.service}?`)) return;
      accounts = accounts.filter((item) => item.id !== record.id);
      renderAccounts();
      saveAccounts();
    });
    actions.append(copy, remove);
    titleBlock.append(title, subtitle, settings);
    top.append(titleBlock, actions);

    const timerMeta = makeElement("div", "timer-meta");
    const timerLabel = makeElement("span", "", "New code in");
    const timer = makeElement("span", "countdown", "—");
    timerMeta.append(timerLabel, timer);
    const track = makeElement("div", "timer-track");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `Time remaining for ${record.service} code`);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(record.period));
    const fill = makeElement("div", "timer-fill");
    track.append(fill);
    codeRow.append(code, copy);
    card.append(top, codeRow, timerMeta, track);
    accountNodes.set(record.id, { record, code, timer, track, fill, lastCounter: null });
    return card;
  }

  function renderAccounts() {
    const list = $("account-list");
    accountNodes.clear();
    list.replaceChildren(...accounts.map(createAccountCard));
    $("empty-state").hidden = accounts.length > 0;
    $("account-count").textContent = `${accounts.length} ${accounts.length === 1 ? "account" : "accounts"}`;
    updateCodes();
  }

  async function generateCode(record, counter) {
    const key = await crypto.subtle.importKey(
      "raw",
      decodeBase32(record.secret),
      { name: "HMAC", hash: record.algorithm },
      false,
      ["sign"],
    );
    const message = new Uint8Array(8);
    let value = BigInt(counter);
    for (let index = 7; index >= 0; index -= 1) {
      message[index] = Number(value & 255n);
      value >>= 8n;
    }
    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, message));
    const offset = digest[digest.length - 1] & 15;
    const binary = ((digest[offset] & 127) << 24)
      | ((digest[offset + 1] & 255) << 16)
      | ((digest[offset + 2] & 255) << 8)
      | (digest[offset + 3] & 255);
    return String(binary % (10 ** record.digits)).padStart(record.digits, "0");
  }

  async function updateCodes() {
    if (refreshing) return;
    refreshing = true;
    try {
      const now = Date.now() / 1000;
      for (const item of accountNodes.values()) {
        const counter = Math.floor(now / item.record.period);
        const remaining = item.record.period - (Math.floor(now) % item.record.period);
        item.timer.textContent = `${remaining}s`;
        item.track.setAttribute("aria-valuenow", String(remaining));
        item.track.setAttribute("aria-valuetext", `${remaining} seconds remaining`);
        item.fill.style.width = `${(remaining / item.record.period) * 100}%`;
        item.fill.dataset.ending = String(remaining <= 5);
        if (item.lastCounter === counter) continue;
        item.lastCounter = counter;
        try {
          const code = await generateCode(item.record, counter);
          item.code.textContent = `${code.slice(0, Math.ceil(code.length / 2))} ${code.slice(Math.ceil(code.length / 2))}`;
          item.code.dataset.currentCode = code;
          delete item.code.dataset.state;
        } catch {
          item.code.textContent = "Code generation unavailable";
          item.code.dataset.state = "error";
          delete item.code.dataset.currentCode;
        }
      }
    } finally {
      refreshing = false;
    }
  }

  function makeId() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  $("toggle-secret").addEventListener("click", () => {
    const input = $("secret");
    const visible = input.type === "password";
    input.type = visible ? "text" : "password";
    $("toggle-secret").textContent = visible ? "Hide" : "Show";
    $("toggle-secret").setAttribute("aria-pressed", String(visible));
  });

  $("entry-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const service = $("service").value.trim();
    const account = $("account").value.trim();
    const secret = normalizeSecret($("secret").value);
    if (!service) {
      setStatus($("entry-status"), "Enter a service or website name.", "error");
      $("service").focus();
      return;
    }
    if (accounts.length >= MAX_ACCOUNTS) {
      setStatus($("entry-status"), `You can save up to ${MAX_ACCOUNTS} accounts in this browser.`, "error");
      return;
    }
    try {
      decodeBase32(secret);
      accounts.push(validateEntry({
        id: makeId(),
        service,
        account,
        secret,
        algorithm: $("algorithm").value,
        digits: Number($("digits").value),
        period: Number($("period").value),
      }));
      renderAccounts();
      saveAccounts();
      event.target.reset();
      $("toggle-secret").textContent = "Show";
      $("toggle-secret").setAttribute("aria-pressed", "false");
      setStatus($("entry-status"), "Account added. Its code refreshes automatically.", "success");
    } catch (error) {
      setStatus($("entry-status"), error.message || "Enter a valid Base32 secret.", "error");
      $("secret").focus();
    }
  });

  function toBase64(bytes) {
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  }

  function fromBase64(value) {
    if (typeof value !== "string" || value.length > 2_000_000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
      throw new Error("Backup file is invalid or too large.");
    }
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  }

  async function deriveBackupKey(passphrase, salt) {
    const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  }

  $("export-backup").addEventListener("click", async () => {
    if (!accounts.length) {
      setStatus($("backup-status"), "Add at least one account before creating a backup.", "error");
      return;
    }
    const passphrase = $("backup-passphrase").value;
    if (passphrase.length < 12) {
      setStatus($("backup-status"), "Use a passphrase of at least 12 characters.", "error");
      $("backup-passphrase").focus();
      return;
    }
    if (passphrase !== $("backup-confirm").value) {
      setStatus($("backup-status"), "The passphrases do not match.", "error");
      $("backup-confirm").focus();
      return;
    }
    const button = $("export-backup");
    button.disabled = true;
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveBackupKey(passphrase, salt);
      const payload = encoder.encode(JSON.stringify({ version: BACKUP_VERSION, accounts }));
      const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload));
      const backup = {
        type: BACKUP_TYPE,
        version: BACKUP_VERSION,
        cipher: "AES-256-GCM",
        kdf: "PBKDF2-SHA-256",
        iterations: PBKDF2_ITERATIONS,
        salt: toBase64(salt),
        iv: toBase64(iv),
        ciphertext: toBase64(ciphertext),
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `masoomdev-totp-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus($("backup-status"), "Encrypted backup downloaded. Keep its passphrase safe.", "success");
    } catch {
      setStatus($("backup-status"), "Could not create the encrypted backup in this browser.", "error");
    } finally {
      button.disabled = false;
      $("backup-passphrase").value = "";
      $("backup-confirm").value = "";
    }
  });

  $("restore-backup").addEventListener("click", async () => {
    const file = $("backup-file").files[0];
    const passphrase = $("restore-passphrase").value;
    if (!file) {
      setStatus($("backup-status"), "Choose an encrypted backup file first.", "error");
      $("backup-file").focus();
      return;
    }
    if (file.size > 1_000_000) {
      setStatus($("backup-status"), "This backup is too large to restore.", "error");
      return;
    }
    if (!passphrase) {
      setStatus($("backup-status"), "Enter the backup passphrase.", "error");
      $("restore-passphrase").focus();
      return;
    }
    const button = $("restore-backup");
    button.disabled = true;
    try {
      const backup = JSON.parse(await file.text());
      if (!backup || backup.type !== BACKUP_TYPE || backup.version !== BACKUP_VERSION || backup.cipher !== "AES-256-GCM" || backup.kdf !== "PBKDF2-SHA-256" || backup.iterations !== PBKDF2_ITERATIONS) {
        throw new Error("This is not a supported TOTP backup.");
      }
      const salt = fromBase64(backup.salt);
      const iv = fromBase64(backup.iv);
      const ciphertext = fromBase64(backup.ciphertext);
      if (salt.length !== 16 || iv.length !== 12 || ciphertext.length > 1_000_000) throw new Error("Backup file is invalid or too large.");
      const key = await deriveBackupKey(passphrase, salt);
      const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
      const payload = JSON.parse(decoder.decode(plaintext));
      if (!payload || payload.version !== BACKUP_VERSION || !Array.isArray(payload.accounts) || payload.accounts.length > MAX_ACCOUNTS) {
        throw new Error("Backup contents are invalid.");
      }
      const restored = payload.accounts.map(validateEntry);
      const merged = new Map(accounts.map((item) => [item.id, item]));
      for (const item of restored) merged.set(item.id, item);
      if (merged.size > MAX_ACCOUNTS) throw new Error(`Restoring would exceed the ${MAX_ACCOUNTS}-account limit.`);
      accounts = [...merged.values()];
      renderAccounts();
      saveAccounts();
      setStatus($("backup-status"), `Restored ${restored.length} ${restored.length === 1 ? "account" : "accounts"} and merged with this browser.`, "success");
    } catch (error) {
      setStatus($("backup-status"), error.message === "This is not a supported TOTP backup." || error.message === "Backup contents are invalid." || error.message.startsWith("Restoring would exceed")
        ? error.message
        : "Could not decrypt this backup. Check the file and passphrase.", "error");
    } finally {
      button.disabled = false;
      $("restore-passphrase").value = "";
    }
  });

  if (!window.crypto?.subtle) {
    setStatus($("entry-status"), "Secure browser cryptography is unavailable. Open this page over HTTPS to generate codes and backups.", "error");
  }
  loadAccounts();
  renderAccounts();
  window.setInterval(updateCodes, 1000);
})();
