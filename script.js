const MASTER_USERNAME = "06231997";
const MASTER_PASSWORD = "06231997";
const DEFAULT_ADMIN_USERNAME = "1234567899";
const DEFAULT_ADMIN_PASSWORD = "1234567899";

let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
let editMode = localStorage.getItem("editMode") === "true";
let currentPageId = null;
let saveTimer = null;

const defaultPages = [
  { id: 1001, name: "About Us", text: "Welcome to the About Us page. You can edit this text after logging in.", link: "", openNewTab: false },
  { id: 1002, name: "Services", text: "This page can contain your services, offers, process, or instructions.", link: "", openNewTab: false },
  { id: 1003, name: "Contact", text: "Add your contact details here.", link: "", openNewTab: false }
];

const defaultEditableText = {
  siteBrand: "My Editable Website",
  loginTitle: "Admin Login",
  usernameLabel: "Username",
  passwordLabel: "Password",
  submitLoginText: "Submit",
  homeTitle: "Home",
  homeSubtitle: "Anyone can view the buttons and pages. Admin can edit after logging in.",
  footerText: "Simple HTML, CSS, and JavaScript website using localStorage."
};

function getAdminCredentials() {
  const saved = localStorage.getItem("adminCredentials");
  if (!saved) {
    const defaults = { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD };
    localStorage.setItem("adminCredentials", JSON.stringify(defaults));
    return defaults;
  }
  const creds = JSON.parse(saved);
  return {
    username: creds.username || DEFAULT_ADMIN_USERNAME,
    password: creds.password || DEFAULT_ADMIN_PASSWORD
  };
}

function saveAdminCredentials(username, password) {
  localStorage.setItem("adminCredentials", JSON.stringify({ username, password }));
  showSaved();
}

function cloneDefaultPages() { return JSON.parse(JSON.stringify(defaultPages)); }

function normalizePages(pages) {
  return pages.map(page => ({
    id: page.id || Date.now(),
    name: page.name || "Untitled",
    text: page.text || "",
    link: page.link || "",
    openNewTab: Boolean(page.openNewTab)
  }));
}

function getPages() {
  const saved = localStorage.getItem("websitePages");
  if (!saved) {
    localStorage.setItem("websitePages", JSON.stringify(cloneDefaultPages()));
    return cloneDefaultPages();
  }
  const pages = normalizePages(JSON.parse(saved));
  localStorage.setItem("websitePages", JSON.stringify(pages));
  return pages;
}

function savePages(pages) {
  localStorage.setItem("websitePages", JSON.stringify(normalizePages(pages)));
  showSaved();
}

function getEditableText() {
  const saved = localStorage.getItem("editableSiteText");
  if (!saved) {
    localStorage.setItem("editableSiteText", JSON.stringify(defaultEditableText));
    return defaultEditableText;
  }
  return { ...defaultEditableText, ...JSON.parse(saved) };
}

function saveEditableText(key, value) {
  const textData = getEditableText();
  textData[key] = value;
  localStorage.setItem("editableSiteText", JSON.stringify(textData));
  showSaved();
}

function showSaved() {
  const saveStatus = document.getElementById("saveStatus");
  saveStatus.textContent = "Saved automatically";
  saveStatus.classList.remove("hidden");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveStatus.classList.add("hidden"), 1400);
}

function loadEditableText() {
  const textData = getEditableText();
  document.querySelectorAll("[data-edit-key]").forEach(element => {
    const key = element.dataset.editKey;
    if (textData[key] !== undefined) element.textContent = textData[key];
  });
}

function setupEditableTextMode() {
  document.querySelectorAll("[data-edit-key]").forEach(element => {
    const canEdit = isLoggedIn && editMode;
    element.contentEditable = canEdit ? "true" : "false";
    element.classList.toggle("editable-active", canEdit);
    element.oninput = () => { if (canEdit) saveEditableText(element.dataset.editKey, element.textContent.trim()); };
    element.onclick = (event) => { if (canEdit) event.stopPropagation(); };
  });
}

function render() {
  loadEditableText();
  updateLoginUI();
  setupEditableTextMode();
  renderButtons();
  if (currentPageId !== null) renderCurrentPage();
}

function updateLoginUI() {
  document.getElementById("loginStatus").textContent = isLoggedIn ? "Admin Mode" : "View Only";
  document.getElementById("loginToggleBtn").classList.toggle("hidden", isLoggedIn);
  document.getElementById("logoutBtn").classList.toggle("hidden", !isLoggedIn);
  document.getElementById("settingsBtn").classList.toggle("hidden", !isLoggedIn);
  document.getElementById("editModeBtn").classList.toggle("hidden", !isLoggedIn);
  document.getElementById("editModeBtn").textContent = editMode ? "Edit Mode: ON" : "Edit Mode: OFF";
  document.getElementById("addButtonBtn").classList.toggle("hidden", !isLoggedIn);
  document.getElementById("editTextBtn").classList.toggle("hidden", !isLoggedIn);
  document.getElementById("adminNotice").classList.toggle("hidden", !isLoggedIn);
  document.getElementById("exportBtn").classList.toggle("hidden", !isLoggedIn);
  document.getElementById("importLabel").classList.toggle("hidden", !isLoggedIn);
}

function toggleEditMode() {
  if (!isLoggedIn) return;
  editMode = !editMode;
  localStorage.setItem("editMode", String(editMode));
  render();
}

function toggleLoginBox() {
  document.getElementById("loginBox").classList.toggle("hidden");
  document.getElementById("settingsBox").classList.add("hidden");
  document.getElementById("loginMessage").textContent = "";
}

function toggleSettingsBox() {
  const box = document.getElementById("settingsBox");
  box.classList.toggle("hidden");
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("settingsMessage").textContent = "";
  const creds = getAdminCredentials();
  document.getElementById("newUsername").value = creds.username;
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const admin = getAdminCredentials();
  const isMasterLogin = username === MASTER_USERNAME && password === MASTER_PASSWORD;
  const isAdminLogin = username === admin.username && password === admin.password;

  if (isMasterLogin || isAdminLogin) {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", "true");
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    render();
  } else {
    document.getElementById("loginMessage").textContent = "Incorrect username or password.";
  }
}

function changeCredentials() {
  if (!isLoggedIn) return;
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const msg = document.getElementById("settingsMessage");

  if (!username || !password) {
    msg.textContent = "Username and password cannot be empty.";
    return;
  }
  if (password !== confirmPassword) {
    msg.textContent = "Passwords do not match.";
    return;
  }
  if (username === MASTER_USERNAME) {
    msg.textContent = "This username is reserved for the master login.";
    return;
  }
  saveAdminCredentials(username, password);
  msg.style.color = "#16a34a";
  msg.textContent = "Login updated successfully.";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
}

function logout() {
  isLoggedIn = false;
  editMode = false;
  localStorage.setItem("isLoggedIn", "false");
  localStorage.setItem("editMode", "false");
  document.getElementById("settingsBox").classList.add("hidden");
  cancelTextEdit();
  render();
}

function renderButtons() {
  const pages = getPages();
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  const filteredPages = pages.filter(page => page.name.toLowerCase().includes(search));
  const buttonList = document.getElementById("buttonList");
  buttonList.innerHTML = "";

  if (filteredPages.length === 0) {
    buttonList.innerHTML = '<div class="button-card">No pages found.</div>';
    return;
  }

  filteredPages.forEach(page => {
    const card = document.createElement("div");
    card.className = "button-card";

    const mainButton = document.createElement("button");
    mainButton.className = "main-page-btn";
    mainButton.textContent = page.name;
    mainButton.onclick = () => openButton(page.id);
    card.appendChild(mainButton);

    if (isLoggedIn) {
      const actions = document.createElement("div");
      actions.className = "admin-actions";
      const actionsData = [
        ["Rename", () => editButtonName(page.id), ""],
        [page.link ? "Edit Link" : "Add Link", () => setButtonLink(page.id), ""],
        ["Clear Link", () => clearButtonLink(page.id), "", !page.link],
        [page.openNewTab ? "Open Same Tab" : "Open New Tab", () => toggleButtonTab(page.id), "", !page.link],
        ["Move Up", () => moveButton(page.id, -1), ""],
        ["Move Down", () => moveButton(page.id, 1), ""],
        ["Delete", () => deleteButton(page.id), "danger"]
      ];
      actionsData.forEach(([text, handler, className, disabled]) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.onclick = handler;
        if (className) btn.className = className;
        if (disabled) btn.disabled = true;
        actions.appendChild(btn);
      });
      card.appendChild(actions);
    }
    buttonList.appendChild(card);
  });
}

function openButton(id) {
  const page = getPages().find(p => p.id === id);
  if (!page) return;
  if (page.link && page.link.trim()) {
    if (page.openNewTab) window.open(page.link.trim(), "_blank");
    else window.location.href = page.link.trim();
    return;
  }
  openPage(id);
}

function cleanUrl(url) {
  url = url.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return url;
}

function setButtonLink(id) {
  const pages = getPages();
  const page = pages.find(p => p.id === id);
  if (!page) return;
  const link = prompt("Enter the link for this button. Example: https://google.com", page.link || "");
  if (link === null) return;
  page.link = cleanUrl(link);
  if (page.link && !page.openNewTab) page.openNewTab = confirm("Open this link in a new tab?");
  savePages(pages);
  render();
}

function clearButtonLink(id) {
  const pages = getPages();
  const page = pages.find(p => p.id === id);
  if (!page) return;
  page.link = "";
  page.openNewTab = false;
  savePages(pages);
  render();
}

function toggleButtonTab(id) {
  const pages = getPages();
  const page = pages.find(p => p.id === id);
  if (!page || !page.link) return;
  page.openNewTab = !page.openNewTab;
  savePages(pages);
  render();
}

function addNewButton() {
  const buttonName = prompt("Enter new button name:");
  if (!buttonName || !buttonName.trim()) return;
  const pages = getPages();
  const addLink = confirm("Do you want this button to open a link instead of a text page?");
  let link = "";
  let openNewTab = false;
  if (addLink) {
    const enteredLink = prompt("Enter the link. Example: https://google.com", "https://");
    link = enteredLink ? cleanUrl(enteredLink) : "";
    if (link) openNewTab = confirm("Open this link in a new tab?");
  }
  pages.push({ id: Date.now(), name: buttonName.trim(), text: "New page text. Click Edit Page Text to change this.", link, openNewTab });
  savePages(pages);
  render();
}

function editButtonName(id) {
  const pages = getPages();
  const page = pages.find(p => p.id === id);
  if (!page) return;
  const newName = prompt("Edit button name:", page.name);
  if (!newName || !newName.trim()) return;
  page.name = newName.trim();
  savePages(pages);
  render();
}

function moveButton(id, direction) {
  const pages = getPages();
  const index = pages.findIndex(p => p.id === id);
  const newIndex = index + direction;
  if (index < 0 || newIndex < 0 || newIndex >= pages.length) return;
  [pages[index], pages[newIndex]] = [pages[newIndex], pages[index]];
  savePages(pages);
  render();
}

function deleteButton(id) {
  if (!confirm("Are you sure you want to delete this button and its page content?")) return;
  let pages = getPages().filter(p => p.id !== id);
  savePages(pages);
  if (currentPageId === id) goHome(); else render();
}

function openPage(id) {
  currentPageId = id;
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("pageView").classList.remove("hidden");
  renderCurrentPage();
}

function renderCurrentPage() {
  const page = getPages().find(p => p.id === currentPageId);
  if (!page) { goHome(); return; }
  document.getElementById("currentPageTitle").textContent = page.name;
  document.getElementById("pageTextDisplay").textContent = page.text || "No text yet.";
  document.getElementById("pageTextInput").value = page.text || "";
  document.getElementById("editTextBtn").classList.toggle("hidden", !isLoggedIn);
}

function enableTextEdit() {
  if (!isLoggedIn) return;
  document.getElementById("pageTextDisplay").classList.add("hidden");
  document.getElementById("pageTextEditor").classList.remove("hidden");
}

function formatText(type) {
  const textarea = document.getElementById("pageTextInput");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || "text";
  let replacement = selected;
  if (type === "bold") replacement = `**${selected}**`;
  if (type === "italic") replacement = `*${selected}*`;
  if (type === "bullet") replacement = selected.split("\n").map(line => `• ${line}`).join("\n");
  if (type === "link") {
    const url = prompt("Enter link URL:", "https://");
    if (!url) return;
    replacement = `${selected} (${url})`;
  }
  textarea.setRangeText(replacement, start, end, "end");
  textarea.focus();
}

function savePageText() {
  if (!isLoggedIn) return;
  const pages = getPages();
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;
  page.text = document.getElementById("pageTextInput").value;
  savePages(pages);
  cancelTextEdit();
  renderCurrentPage();
}

function cancelTextEdit() {
  const display = document.getElementById("pageTextDisplay");
  const editor = document.getElementById("pageTextEditor");
  if (display && editor) {
    display.classList.remove("hidden");
    editor.classList.add("hidden");
  }
}

function goHome() {
  currentPageId = null;
  cancelTextEdit();
  document.getElementById("pageView").classList.add("hidden");
  document.getElementById("homeView").classList.remove("hidden");
  render();
}

function exportData() {
  const backup = {
    websitePages: getPages(),
    editableSiteText: getEditableText(),
    adminCredentials: getAdminCredentials(),
    exportedAt: new Date().toISOString(),
    note: "Rename this exported file to backup.json and upload it to GitHub root to update everyone."
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "website-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.websitePages) || !data.editableSiteText) throw new Error("Invalid backup file.");
      localStorage.setItem("websitePages", JSON.stringify(normalizePages(data.websitePages)));
      localStorage.setItem("editableSiteText", JSON.stringify(data.editableSiteText));
      if (data.adminCredentials && data.adminCredentials.username && data.adminCredentials.password) {
        localStorage.setItem("adminCredentials", JSON.stringify(data.adminCredentials));
      }
      showSaved();
      render();
      alert("Backup imported successfully.");
    } catch (error) {
      alert("Import failed. Please use a valid website backup JSON file.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}


async function loadSharedBackupFromGitHub() {
  try {
    const response = await fetch("backup.json?cache=" + Date.now(), { cache: "no-store" });
    if (!response.ok) {
      render();
      return;
    }

    const data = await response.json();
    const hasValidPages = Array.isArray(data.websitePages);
    const hasValidText = data.editableSiteText && typeof data.editableSiteText === "object";

    if (!hasValidPages || !hasValidText) {
      render();
      return;
    }

    const remoteStamp = data.exportedAt || "no-date-backup";
    const localStamp = localStorage.getItem("sharedBackupTimestamp") || "";

    if (!localStamp || remoteStamp > localStamp) {
      localStorage.setItem("websitePages", JSON.stringify(normalizePages(data.websitePages)));
      localStorage.setItem("editableSiteText", JSON.stringify(data.editableSiteText));

      if (data.adminCredentials && data.adminCredentials.username && data.adminCredentials.password) {
        localStorage.setItem("adminCredentials", JSON.stringify(data.adminCredentials));
      }

      localStorage.setItem("sharedBackupTimestamp", remoteStamp);
    }
  } catch (error) {
    // No backup.json found or backup could not be loaded. Continue using local data.
  }

  render();
}

loadSharedBackupFromGitHub();
