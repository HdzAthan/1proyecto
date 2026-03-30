// ===== CONSTANTES =====
const STORAGE_KEY = "rifaUsuarios";
const ENCRYPTION_KEY = "RifaLocalKey2026";
const TOTAL_NUMBERS_KEY = "rifaTotalNumbers";
const SELECTED_NUMBERS_KEY = "rifaSelectedNumbers";

const grid = document.getElementById("rifaGrid");
const btnRuleta = document.getElementById("btnRuleta");
const btnValidar = document.getElementById("btnValidar");
const codigoInput = document.getElementById("codigo");
const codigoStatus = document.getElementById("codigoStatus");
const maxSelectionInfo = document.getElementById("maxSelectionInfo");
const resultadoRuleta = document.getElementById("ruletaResultado");
const usuariosContainer = document.getElementById("usuariosRegistrados");
const winnerModal = document.getElementById("winnerModal");
const modalNumero = document.getElementById("modalNumero");
const modalUsuario = document.getElementById("modalUsuario");
const closeModal = document.getElementById("closeModal");
const modalAceptar = document.getElementById("modalAceptar");
const btnPrevPage = document.getElementById("btnPrevPage");
const btnNextPage = document.getElementById("btnNextPage");
const pageStatus = document.getElementById("pageStatus");
const paginationControls = document.getElementById("paginationControls");
const PAGE_SIZE = 100;
const WINNER_NUMBER_KEY = "rifaWinnerNumber";
const WINNER_CODE_KEY = "rifaWinnerCode";
let rouletteInterval = null;
let currentUser = null;
let currentCode = "";
let selectionLimit = 0;
let selectedCount = 0;
let currentPage = 1;
let totalPages = 1;
let winnerNumber = null;
let winnerCode = "";
const selectedNumbers = loadSelectedNumbers();
loadWinnerState();

function getTotalNumbers() {
  const storedValue = Number(localStorage.getItem(TOTAL_NUMBERS_KEY));
  return Number.isInteger(storedValue) && storedValue > 0 ? storedValue : 100;
}

function isSelectionComplete() {
  return currentUser && selectionLimit > 0 && getSelectedCountForCurrentCode() >= selectionLimit;
}

function lockNumbers() {
  document.querySelectorAll(".numero").forEach((numero) => {
    if (!numero.classList.contains("vendido")) {
      numero.classList.remove("unlocked");
      numero.classList.add("locked");
    }
  });
}

function base64Encode(value) {
  try {
    if (typeof TextEncoder !== "undefined") {
      return btoa(String.fromCharCode(...new TextEncoder().encode(value)));
    }
  } catch (error) {
    // Fallback for older browsers
  }
  return btoa(unescape(encodeURIComponent(value)));
}

function base64Decode(value) {
  try {
    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder().decode(Uint8Array.from(atob(value), (c) => c.charCodeAt(0)));
    }
  } catch (error) {
    // Fallback for older browsers
  }
  return decodeURIComponent(escape(atob(value)));
}

function xorCipher(text) {
  return [...text]
    .map((character, index) =>
      String.fromCharCode(
        character.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(index % ENCRYPTION_KEY.length)
      )
    )
    .join("");
}

function encrypt(value) {
  return base64Encode(xorCipher(value));
}

function decrypt(value) {
  try {
    return xorCipher(base64Decode(value));
  } catch (error) {
    return String(value || "");
  }
}

function getStoredUsers() {
  try {
    const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(usuarios) ? usuarios.filter((usuario) => usuario && usuario.codigo != null) : [];
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function loadSelectedNumbers() {
  try {
    const stored = localStorage.getItem(SELECTED_NUMBERS_KEY);
    if (!stored) return new Map();
    const parsed = JSON.parse(stored);
    return new Map(Object.entries(parsed).map(([key, value]) => [Number(key), String(value)]));
  } catch {
    localStorage.removeItem(SELECTED_NUMBERS_KEY);
    return new Map();
  }
}

function saveSelectedNumbers() {
  const objectToSave = Object.fromEntries(Array.from(selectedNumbers.entries()));
  localStorage.setItem(SELECTED_NUMBERS_KEY, JSON.stringify(objectToSave));
}

function loadWinnerState() {
  const storedValue = Number(localStorage.getItem(WINNER_NUMBER_KEY));
  const storedCode = String(localStorage.getItem(WINNER_CODE_KEY) || "");
  if (Number.isInteger(storedValue) && storedValue > 0) {
    winnerNumber = storedValue;
  }
  winnerCode = storedCode;
}

function saveWinnerState(number, code) {
  winnerNumber = number;
  winnerCode = String(code || "");
  localStorage.setItem(WINNER_NUMBER_KEY, String(number));
  localStorage.setItem(WINNER_CODE_KEY, winnerCode);
}

function clearWinnerState() {
  winnerNumber = null;
  winnerCode = "";
  localStorage.removeItem(WINNER_NUMBER_KEY);
  localStorage.removeItem(WINNER_CODE_KEY);
}

function getTotalAllocatedTickets() {
  return getStoredUsers().reduce((total, usuario) => {
    const paquete = Number(decrypt(usuario.paquete) || 0);
    return total + (Number.isNaN(paquete) ? 0 : paquete);
  }, 0);
}

function getAvailableTickets() {
  return Math.max(0, getTotalNumbers() - getTotalAllocatedTickets());
}

function saveUser(user) {
  const usuarios = getStoredUsers();
  usuarios.push({
    nombre: encrypt(user.nombre),
    apellido: encrypt(user.apellido),
    cedula: encrypt(user.cedula),
    telefono: encrypt(user.telefono),
    email: encrypt(user.email),
    paquete: encrypt(user.paquete),
    codigo: encrypt(user.codigo),
    registrado: user.registrado,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

function generateCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function createNumberGrid() {
  const totalNumbers = getTotalNumbers();
  totalPages = Math.max(1, Math.ceil(totalNumbers / PAGE_SIZE));
  if (winnerNumber !== null) {
    currentPage = Math.min(Math.max(1, Math.ceil(winnerNumber / PAGE_SIZE)), totalPages);
  } else {
    currentPage = Math.min(currentPage, totalPages);
  }
  renderPage(currentPage);
}

function renderPage(page) {
  const totalNumbers = getTotalNumbers();
  totalPages = Math.max(1, Math.ceil(totalNumbers / PAGE_SIZE));
  currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(totalNumbers, currentPage * PAGE_SIZE);

  grid.innerHTML = "";

  for (let i = start; i <= end; i++) {
    const numero = document.createElement("div");
    numero.classList.add("numero");
    numero.dataset.number = i;
    numero.textContent = i;

    const selectedCode = selectedNumbers.get(i);
    const selectionComplete = isSelectionComplete();

    if (selectedCode) {
      numero.classList.add("vendido", "selected-by-user");
      numero.dataset.codigo = selectedCode;
      numero.classList.remove("locked", "unlocked");
    } else if (currentUser && !selectionComplete) {
      numero.classList.add("unlocked");
      numero.classList.remove("locked");
    } else {
      numero.classList.add("locked");
      numero.classList.remove("unlocked");
    }

    if (winnerNumber === i) {
      numero.classList.add("winner");
    }

    numero.addEventListener("click", function () {
      if (numero.classList.contains("locked") || numero.classList.contains("vendido")) {
        return;
      }

      if (!currentUser) {
        codigoStatus.textContent = "Ingresa un código válido antes de seleccionar números.";
        codigoStatus.classList.remove("exito");
        codigoStatus.classList.add("error");
        return;
      }

      selectedCount = getSelectedCountForCurrentCode();
      if (selectedCount >= selectionLimit) {
        codigoStatus.textContent = `Ya alcanzaste el límite de ${selectionLimit} número(s).`;
        codigoStatus.classList.remove("exito");
        codigoStatus.classList.add("error");
        return;
      }

      selectedNumbers.set(i, currentCode);
      saveSelectedNumbers();
      numero.classList.add("vendido", "selected-by-user");
      numero.dataset.codigo = currentCode;
      numero.classList.remove("unlocked");
      selectedCount += 1;
      codigoStatus.textContent = "Número seleccionado correctamente.";
      codigoStatus.classList.remove("error");
      codigoStatus.classList.add("exito");
      setSelectionInfo();

      const totalVendidos = selectedNumbers.size;
      const selectionCompletedNow = isSelectionComplete();

      if (selectionCompletedNow) {
        codigoStatus.textContent = `Has completado tu selección de ${selectionLimit} números.`;
        lockNumbers();
        if (totalVendidos !== totalNumbers) {
          setTimeout(() => {
            location.reload();
          }, 800);
        }
      }

      if (totalVendidos === totalNumbers) {
        codigoStatus.textContent = "Todos los números fueron elegidos. Iniciando la ruleta automáticamente...";
        codigoStatus.classList.remove("error");
        codigoStatus.classList.add("exito");
        startRoulette();
      }
    });

    grid.appendChild(numero);
  }

  updatePaginationControls();
}

function showPage(page) {
  renderPage(page);
}

function updatePaginationControls() {
  const totalNumbers = getTotalNumbers();
  totalPages = Math.max(1, Math.ceil(totalNumbers / PAGE_SIZE));
  pageStatus.textContent = `Página ${currentPage} de ${totalPages}`;
  btnPrevPage.disabled = currentPage === 1;
  btnNextPage.disabled = currentPage === totalPages;
  paginationControls.style.display = totalPages > 1 ? "flex" : "none";
}

if (btnPrevPage) {
  btnPrevPage.addEventListener("click", () => {
    showPage(currentPage - 1);
  });
}

if (btnNextPage) {
  btnNextPage.addEventListener("click", () => {
    showPage(currentPage + 1);
  });
}

function getValidUserByCode(code) {
  const trimmedCode = String(code).trim().toUpperCase();
  return getStoredUsers().find((usuario) => {
    try {
      return decrypt(usuario.codigo).toUpperCase() === trimmedCode;
    } catch {
      return false;
    }
  });
}

function getSelectedCountForCurrentCode() {
  if (!currentCode) return 0;
  return Array.from(selectedNumbers.values()).filter((code) => code === currentCode).length;
}

function setSelectionInfo() {
  if (!currentUser) {
    if (maxSelectionInfo) maxSelectionInfo.textContent = "";
    return;
  }
  if (maxSelectionInfo) {
    maxSelectionInfo.textContent = `Selecciona hasta ${selectionLimit} número(s). Has elegido ${selectedCount}.`;
  }
}

function validateCode(code) {
  const user = getValidUserByCode(code);

  if (!user) {
    codigoStatus.textContent = "Código inválido. Intenta nuevamente.";
    codigoStatus.classList.remove("exito");
    codigoStatus.classList.add("error");
    return false;
  }

  currentUser = user;
  currentCode = decrypt(user.codigo).toUpperCase();
  selectionLimit = Number(decrypt(user.paquete)) || 0;
  selectedCount = getSelectedCountForCurrentCode();

  codigoStatus.textContent = "Código válido. Ahora puedes seleccionar tus números.";
  codigoStatus.classList.remove("error");
  codigoStatus.classList.add("exito");
  setSelectionInfo();
  btnRuleta.disabled = false;
  unlockNumbers();
  return true;
}

function maskText(value, start = 1, end = 1) {
  const clean = String(value);
  if (clean.length <= start + end) {
    return "*".repeat(clean.length);
  }
  return `${clean.slice(0, start)}${"*".repeat(clean.length - start - end)}${clean.slice(-end)}`;
}

function maskName(name) {
  const value = String(name).trim();
  return value.length > 2 ? `${value[0]}${"*".repeat(value.length - 2)}${value.slice(-1)}` : "*".repeat(value.length);
}

function maskEmail(email) {
  const value = String(email).trim();
  const parts = value.split("@");
  if (parts.length !== 2) return maskText(value, 2, 0);
  const [local, domain] = parts;
  const maskedLocal = local.length > 2 ? `${local.slice(0, 2)}${"*".repeat(local.length - 2)}` : "**";
  return `${maskedLocal}@${domain}`;
}

function maskPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length <= 4) return "****";
  return `***${digits.slice(-3)}`;
}

function maskCedula(cedula) {
  const digits = String(cedula).replace(/\D/g, "");
  if (digits.length <= 4) return "****";
  return `${digits.slice(0, 2)}${"*".repeat(digits.length - 4)}${digits.slice(-2)}`;
}

function renderRegisteredUsers() {
  const usuarios = getStoredUsers();

  if (!usuarios.length) {
    usuariosContainer.innerHTML = '<p class="lista-vacia">No hay usuarios registrados aún.</p>';
    return;
  }

  const currentWinnerCode = winnerCode || (winnerNumber !== null ? String(selectedNumbers.get(Number(winnerNumber)) || "") : "");

  usuariosContainer.innerHTML = usuarios
    .map((usuario) => {
      const nombre = maskName(decrypt(usuario.nombre));
      const apellido = maskName(decrypt(usuario.apellido));
      const email = maskEmail(decrypt(usuario.email));
      const telefono = maskPhone(decrypt(usuario.telefono));
      const cedula = maskCedula(decrypt(usuario.cedula));
      const paquete = decrypt(usuario.paquete);
      const codigo = decrypt(usuario.codigo);
      const completedCount = Array.from(selectedNumbers.values()).filter((entry) => entry === codigo).length;
      const isComplete = Number(paquete) > 0 && completedCount >= Number(paquete);
      const isWinner = codigo.toUpperCase().trim() === currentWinnerCode.toUpperCase().trim();

      return `
        <div class="usuario-card">
          <div>
            <p><strong>${nombre} ${apellido}</strong></p>
            <p>${email} · ${telefono}</p>
            <p class="usuario-meta">${cedula} · ${usuario.registrado}</p>
            <p class="usuario-meta">Código: ${codigo}${isComplete ? ' <span class="user-status">✔</span>' : ''}${isWinner ? ' <span class="user-winner">GANADOR</span>' : ''}</p>
          </div>
          <span>${paquete} números</span>
        </div>
      `;
    })
    .join("");
}

function unlockNumbers() {
  renderPage(currentPage);
}

function resetRouletteState() {
  document.querySelectorAll(".numero.ganando, .numero.winner").forEach((element) => {
    element.classList.remove("ganando", "winner");
  });
}

function showWinnerModal(winnerNumber, user) {
  modalNumero.textContent = winnerNumber;

  if (user) {
    const nombre = decrypt(user.nombre);
    const apellido = decrypt(user.apellido);
    const email = decrypt(user.email);
    const telefono = decrypt(user.telefono);
    const cedula = decrypt(user.cedula);
    const paquete = decrypt(user.paquete);
    const codigo = decrypt(user.codigo);

    modalUsuario.innerHTML = `
      <p><strong>Usuario:</strong> ${nombre} ${apellido}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Cédula:</strong> ${cedula}</p>
      <p><strong>Paquete:</strong> ${paquete} números</p>
      <p><strong>Código:</strong> ${codigo}</p>
    `;
  } else {
    modalUsuario.innerHTML = `<p>No hay usuario asignado a este número ganador.</p>`;
  }

  winnerModal.classList.remove("hidden");
  setTimeout(() => {
    location.reload();
  }, 5000);
}

function hideWinnerModal() {
  winnerModal.classList.add("hidden");
}

function startRoulette() {
  const totalNumbers = getTotalNumbers();
  if (totalNumbers === 0 || rouletteInterval) return;

  btnRuleta.disabled = true;
  resultadoRuleta.textContent = "Girando la ruleta...";
  resetRouletteState();

  const winnerIndex = Math.floor(Math.random() * totalNumbers) + 1;
  const winnerPage = Math.ceil(winnerIndex / PAGE_SIZE);
  showPage(winnerPage);

  const numeros = Array.from(document.querySelectorAll(".numero"));
  if (numeros.length === 0) {
    return;
  }

  let currentIndex = 0;
  rouletteInterval = setInterval(() => {
    numeros.forEach((numero) => numero.classList.remove("ganando"));
    const active = numeros[currentIndex];
    active.classList.add("ganando");
    currentIndex = (currentIndex + 1) % numeros.length;
  }, 60);

  setTimeout(() => {
    clearInterval(rouletteInterval);
    rouletteInterval = null;
    numeros.forEach((numero) => numero.classList.remove("ganando"));

    winnerNumber = winnerIndex;
    const winnerNumberString = String(winnerIndex);
    const winner = document.querySelector(`.numero[data-number="${winnerNumberString}"]`);
    if (winner) {
      winner.classList.add("winner");
      resultadoRuleta.textContent = `Número ganador: ${winner.textContent}`;
    }

    const winnerCodeFromNumber = winner?.dataset.codigo || "";
    saveWinnerState(winnerIndex, winnerCodeFromNumber);
    const winnerUser = winnerCodeFromNumber ? getValidUserByCode(winnerCodeFromNumber) : null;
    showWinnerModal(winnerNumberString, winnerUser);
    renderRegisteredUsers();
  }, 2400);
}

createNumberGrid();
renderRegisteredUsers();

if (btnValidar) {
  btnValidar.addEventListener("click", () => {
    const code = codigoInput?.value || "";
    if (validateCode(code)) {
      codigoInput.value = "";
    }
  });
}

if (btnRuleta) {
  btnRuleta.addEventListener("click", () => {
    if (!currentUser) {
      codigoStatus.textContent = "Ingresa un código válido antes de girar la ruleta.";
      codigoStatus.classList.remove("exito");
      codigoStatus.classList.add("error");
      return;
    }
    startRoulette();
  });
}

if (closeModal) {
  closeModal.addEventListener("click", hideWinnerModal);
}

if (modalAceptar) {
  modalAceptar.addEventListener("click", hideWinnerModal);
}
