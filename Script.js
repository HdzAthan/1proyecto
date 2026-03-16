const grid = document.getElementById("rifaGrid");

for (let i = 1; i <= 100; i++) {
  const numero = document.createElement("div");
  numero.classList.add("numero");
  numero.textContent = i;

  numero.addEventListener("click", function () {
    if (!numero.classList.contains("vendido")) {
      numero.classList.add("vendido");
    }
  });

  grid.appendChild(numero);
}
