document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const btnSearch = document.getElementById("btnSearch");
  const resultsContainer = document.getElementById("searchResults");

  btnSearch.addEventListener("click", async () => {
    const text = searchInput.value.trim();
    if (!text) return alert("Escribe algo para buscar 🔍");

    resultsContainer.innerHTML = "<p>Cargando resultados...</p>";

    try {
      const res = await fetch("/api/v1/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, types: ["place","event"], page: 1, limit: 20 })
      });
      const data = await res.json();

      if (!data.items.length) {
        resultsContainer.innerHTML = "<p>No se encontraron resultados 😢</p>";
        return;
      }

      resultsContainer.innerHTML = ""; // limpiar
      data.items.forEach(item => {
        const div = document.createElement("div");
        div.className = "search-card";

        if (item.type === "place") {
          div.innerHTML = `
            <strong>Lugar:</strong> ${item.data.name || item.data.title}<br>
            <small>${item.data.address || ""}</small>
          `;
        } else if (item.type === "event") {
          div.innerHTML = `
            <strong>Evento:</strong> ${item.data.title}<br>
            <small>${new Date(item.data.dateStart).toLocaleDateString()}</small>
          `;
        }

        resultsContainer.appendChild(div);
      });

    } catch (err) {
      console.error(err);
      resultsContainer.innerHTML = "<p>Error al buscar 😢</p>";
    }
  });
});
