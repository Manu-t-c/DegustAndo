document.addEventListener("DOMContentLoaded", async () => {
  const placesContainer = document.getElementById("places-list");

  try {
    const res = await apiFetch("/places"); // Llama a tu endpoint de lugares
    const places = (res.items || []).map(item => item.data); // <--- aquí accedemos a data

    if (!places.length) {
      placesContainer.innerHTML = "<p>No hay lugares disponibles 😢</p>";
      return;
    }

    places.forEach(place => {
      const card = document.createElement("div");
      card.className = "place-card";
      card.innerHTML = `
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        <p><strong>Dirección:</strong> ${place.address || 'No disponible'}</p>
      `;
      placesContainer.appendChild(card);
    });

  } catch (err) {
    placesContainer.innerHTML = "<p>Error al cargar los lugares 😢</p>";
    console.error(err);
  }
});




