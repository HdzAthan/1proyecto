// ===== MANEJADOR DE FORMULARIO DE REGISTRO =====

const formulario = document.getElementById("formularioRegistro");
const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

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

  if (!nombre || !apellido || !cedula || !telefono || !email) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (!seleccionado) {
    alert("Por favor selecciona un paquete de números.");
    return;
  }

  alert("¡Formulario enviado correctamente!");
  formulario.reset();
  // Aquí podrías agregar lógica de envío real
});
