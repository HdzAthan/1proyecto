const STORAGE_KEY = "rifaUsuarios";
const TOTAL_NUMBERS_KEY = "rifaTotalNumbers";
const ENCRYPTION_KEY = "RifaLocalKey2026";

const formulario = document.getElementById("formularioRegistro");
const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

function getTotalNumbers() {
  const storedValue = Number(localStorage.getItem(TOTAL_NUMBERS_KEY));
  return Number.isInteger(storedValue) && storedValue > 0 ? storedValue : 100;
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
    return Array.isArray(usuarios) ? usuarios : [];
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
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

// Permitir solo un checkbox seleccionado
checkboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    if (cb.checked) {
      checkboxes.forEach((other) => {
        if (other !== cb) other.checked = false;
      });
    }
  });
});

// Validación y envío del formulario
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const cedula = document.getElementById("cedula").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();
  const seleccionado = Array.from(checkboxes).some((cb) => cb.checked);
  const paquete = Array.from(checkboxes).find((cb) => cb.checked)?.value || "";

  if (!nombre || !apellido || !cedula || !telefono || !email) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (!seleccionado) {
    alert("Por favor selecciona un paquete de números.");
    return;
  }

  const disponible = getAvailableTickets();
  const paqueteNumero = Number(paquete);

  if (disponible <= 0) {
    alert("Lo siento, ya no quedan tickets disponibles. No se permiten nuevos registros.");
    return;
  }

  if (paqueteNumero > disponible) {
    alert(`Solo quedan ${disponible} ticket(s) disponibles. Selecciona un paquete menor o espera a que haya disponibilidad.`);
    return;
  }

  const codigo = generateCode(6);
  const nuevoUsuario = {
    nombre,
    apellido,
    cedula,
    telefono,
    email,
    paquete,
    codigo,
    registrado: new Date().toLocaleString(),
  };

  saveUser(nuevoUsuario);
  alert(`¡Formulario enviado correctamente! Tu código para desbloquear los números es: ${codigo}`);
  formulario.reset();
  window.location.href = "index.html";
});
