// 1. EJEMPLOS DE CÓDIGO: {KEY} se reemplaza según el entorno elegido
const ejemplos = {
  cURL: `curl https://api.ejemplo.dev/v1/me \\
  -H "Authorization: Bearer {KEY}"`,
  JavaScript: `const res = await fetch("https://api.ejemplo.dev/v1/me", {
  headers: { Authorization: "Bearer {KEY}" }
});
const datos = await res.json();
console.log(res.status, datos);`,
  Python: `import requests

r = requests.get(
    "https://api.ejemplo.dev/v1/me",
    headers={"Authorization": "Bearer {KEY}"},
)
print(r.status_code, r.json())`
};
const claves = { sandbox: "sk_test_abc123", produccion: "sk_live_xxxxxxxx" };

const selectEntorno = document.getElementById("entorno");
const pestanas = document.getElementById("pestanas");
const codigo = document.getElementById("codigo");
const btnCopiar = document.getElementById("btn-copiar");
let lenguaje = "cURL";

// 2. Pinta el código actual (lenguaje + entorno)
function mostrarCodigo() {
  codigo.textContent = ejemplos[lenguaje].replace("{KEY}", claves[selectEntorno.value]);
}

// 3. Crea las pestañas
function crearPestanas() {
  pestanas.innerHTML = "";
  Object.keys(ejemplos).forEach(nombre => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = nombre;
    b.setAttribute("role", "tab");
    if (nombre === lenguaje) b.classList.add("activa");
    b.addEventListener("click", () => { lenguaje = nombre; crearPestanas(); mostrarCodigo(); });
    pestanas.appendChild(b);
  });
}

// 4. Botón copiar
btnCopiar.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(codigo.textContent);
    btnCopiar.textContent = "Copiado";
  } catch (e) {
    btnCopiar.textContent = "No se pudo copiar";
  }
  setTimeout(() => (btnCopiar.textContent = "Copiar"), 1500);
});
selectEntorno.addEventListener("change", mostrarCodigo);

// 5. Buscador con Ctrl+K: busca entre las secciones y títulos de la página
const dialogo = document.getElementById("buscador");
const campo = document.getElementById("q");
const lista = document.getElementById("resultados");
const secciones = [...document.querySelectorAll("h2, h3")].map(h => ({
  texto: h.textContent,
  destino: "#" + (h.id || h.closest("section").id)
}));

function buscar() {
  const t = campo.value.toLowerCase();
  const encontrados = secciones.filter(s => s.texto.toLowerCase().includes(t));
  lista.innerHTML = encontrados.map(s => `<li><a href="${s.destino}">${s.texto}</a></li>`).join("")
    || "<li>Sin resultados</li>";
}
function abrirBuscador() { campo.value = ""; buscar(); dialogo.showModal(); campo.focus(); }

document.getElementById("btn-buscar").addEventListener("click", abrirBuscador);
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); abrirBuscador(); }
});
campo.addEventListener("input", buscar);
lista.addEventListener("click", e => { if (e.target.tagName === "A") dialogo.close(); });
dialogo.addEventListener("click", e => { if (e.target === dialogo) dialogo.close(); });

// 6. Arranque
crearPestanas();
mostrarCodigo();
