
const tablaBody =
  document.getElementById("tabla-riesgos") ||
  document.querySelector("#tabla-riesgos tbody");

const form = document.getElementById("form-riesgo");


const agregarFila = (r) => {
  if (!tablaBody) return;
  const tr = document.createElement("tr");
  const nivel = r.riesgo <= 8 ? "bajo" : r.riesgo <= 15 ? "medio" : "alto";
  tr.classList.add(`row-${nivel}`);
  tr.innerHTML = `
    <td><strong>${r.libreria}</strong></td>
    <td><code>${r.version}</code></td>
    <td>${r.uso}</td>
    <td>${r.prob}</td>
    <td>${r.impacto}</td>
    <td><span class="badge-pill ${nivel}">${r.riesgo}</span></td>
    <td>${r.mitigar}</td>
  `;
  tablaBody.appendChild(tr);
};


const cargar = () => {
  let datos = [];
  try {
    datos = JSON.parse(localStorage.getItem("matriz-riesgos") || "[]");
  } catch {
    datos = [];
  }

  if (!Array.isArray(datos)) datos = [];

  if (tablaBody) {
    tablaBody.innerHTML = "";
    datos.forEach(agregarFila);
  }
};

// ==============================
// Guardar nuevo riesgo
// ==============================
const guardarNuevo = () => {
  const libreria = (document.getElementById("libreria")?.value || "").trim();
  const version = (document.getElementById("version")?.value || "").trim();
  const uso = (document.getElementById("uso")?.value || "").trim();
  const prob = parseInt(document.getElementById("prob")?.value, 10) || 0;
  const impacto = parseInt(document.getElementById("impacto")?.value, 10) || 0;
  const mitigar = (document.getElementById("mitigar")?.value || "").trim();

  if (!libreria || !version || !uso || !prob || !impacto) {
    alert("⚠️ Completa todos los campos antes de agregar un riesgo.");
    return false;
  }

  const nuevo = {
    libreria,
    version,
    uso,
    prob,
    impacto,
    riesgo: prob * impacto,
    mitigar,
  };

  let datos;
  try {
    datos = JSON.parse(localStorage.getItem("matriz-riesgos") || "[]");
  } catch {
    datos = [];
  }

  datos.push(nuevo);
  localStorage.setItem("matriz-riesgos", JSON.stringify(datos));
  return true;
};


document.addEventListener("DOMContentLoaded", () => {
  cargar();

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = guardarNuevo();
      if (!ok) return;

      form.reset();
      cargar();
      if (tablaBody)
        tablaBody.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
});
