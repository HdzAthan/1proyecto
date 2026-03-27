const STORAGE_KEY = "rifaUsuarios";
const ENCRYPTION_KEY = "RifaLocalKey2026";

// ===== GENERAR GRILLA DE NÚMEROS DE RIFA =====
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
let rouletteInterval = null;
btnRuleta.disabled = true;
let currentUser = null;
let currentCode = "";
let selectionLimit = 0;
let selectedCount = 0;

for (let i = 1; i <= 100; i++) {
  const numero = document.createElement("div");
  numero.classList.add("numero", "locked");
  numero.textContent = i;

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

    numero.classList.add("vendido", "selected-by-user");
    numero.dataset.codigo = currentCode;
    selectedCount += 1;
    codigoStatus.textContent = "Número seleccionado correctamente.";
    codigoStatus.classList.remove("error");
    codigoStatus.classList.add("exito");
    setSelectionInfo();

    const totalVendidos = document.querySelectorAll(".numero.vendido").length;
    if (totalVendidos === 100) {
      codigoStatus.textContent = "Todos los números fueron elegidos. Iniciando la ruleta automáticamente...";
      codigoStatus.classList.remove("error");
      codigoStatus.classList.add("exito");
      startRoulette();
    }
  });

  grid.appendChild(numero);
}

function base64Encode(value) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(value)));
}

function base64Decode(value) {
  return new TextDecoder().decode(Uint8Array.from(atob(value), (c) => c.charCodeAt(0)));
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

function decrypt(value) {
  try {
    return xorCipher(base64Decode(value));
  } catch (error) {
    return value;
  }
}

function getStoredUsers() {
  const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const limpiados = usuarios.filter((usuario) => {
    return usuario && usuario.codigo != null && String(usuario.codigo).trim() !== "";
  });

  if (limpiados.length !== usuarios.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limpiados));
  }

  return limpiados;
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
  return document.querySelectorAll(`.numero[data-codigo="${currentCode}"]`).length;
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

  usuariosContainer.innerHTML = usuarios
    .map((usuario) => {
      const nombre = maskName(decrypt(usuario.nombre));
      const apellido = maskName(decrypt(usuario.apellido));
      const email = maskEmail(decrypt(usuario.email));
      const telefono = maskPhone(decrypt(usuario.telefono));
      const cedula = maskCedula(decrypt(usuario.cedula));
      const paquete = decrypt(usuario.paquete);
      const codigo = decrypt(usuario.codigo);

      return `
        <div class="usuario-card">
          <div>
            <p><strong>${nombre} ${apellido}</strong></p>
            <p>${email} · ${telefono}</p>
            <p class="usuario-meta">${cedula} · ${usuario.registrado}</p>
            <p class="usuario-meta">Código: ${codigo}</p>
          </div>
          <span>${paquete} números</span>
        </div>
      `;
    })
    .join("");
}

renderRegisteredUsers();

function unlockNumbers() {
  document.querySelectorAll(".numero.locked").forEach((numero) => {
    numero.classList.remove("locked");
    numero.classList.add("unlocked");
  });
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
}

function hideWinnerModal() {
  winnerModal.classList.add("hidden");
}

function startRoulette() {
  const numeros = Array.from(document.querySelectorAll(".numero"));
  if (numeros.length === 0 || rouletteInterval) return;

  btnRuleta.disabled = true;
  resultadoRuleta.textContent = "Girando la ruleta...";
  resetRouletteState();

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

    const winner = numeros[Math.floor(Math.random() * numeros.length)];
    winner.classList.add("winner");
    resultadoRuleta.textContent = `Número ganador: ${winner.textContent}`;
    unlockNumbers();

    const winnerCode = winner.dataset.codigo || "";
    const winnerUser = winnerCode ? getValidUserByCode(winnerCode) : null;
    showWinnerModal(winner.textContent, winnerUser);
  }, 2400);
}

if (btnValidar) {
  btnValidar.addEventListener("click", () => {
    const code = codigoInput?.value || "";
    if (validateCode(code)) {
      codigoInput.value = "";
    }
  });
}

if (closeModal) {
  closeModal.addEventListener("click", hideWinnerModal);
}

if (modalAceptar) {
  modalAceptar.addEventListener("click", hideWinnerModal);
}
