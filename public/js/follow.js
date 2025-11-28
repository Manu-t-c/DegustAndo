async function loadUsersToFollow() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Traemos todos los usuarios
    const res = await fetch("/api/v1/users", {
      headers: { "Authorization": "Bearer " + token }
    });
    let users = await res.json();

    // Traemos al usuario logueado para filtrar
    const meRes = await fetch("/api/v1/users/me", {
      headers: { "Authorization": "Bearer " + token }
    });
    const me = await meRes.json();

    // Filtrar usuario logueado
    users = users.filter(u => u._id !== me._id);

    // Traemos a quién sigue el usuario logueado
    const followingRes = await fetch("/api/v1/follows/following", {
      headers: { "Authorization": "Bearer " + token }
    });
    const following = await followingRes.json();
    const followingIds = following.map(f => f.following._id);

    // Limpiar contenedor
    const container = document.getElementById("users-list");
    container.innerHTML = "";

    users.forEach(user => {
      const div = document.createElement("div");
      div.classList.add("user-card");
      div.innerHTML = `
        <p>${user.username}</p>
        <button class="follow-btn">${followingIds.includes(user._id) ? "Siguiendo" : "Seguir"}</button>
      `;

      // Botón seguir/dejar de seguir
      const btn = div.querySelector(".follow-btn");
      btn.addEventListener("click", async () => {
        const method = btn.textContent === "Seguir" ? "POST" : "DELETE";
        await fetch("/api/v1/follows", {
          method,
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ following: user._id })
        });
        loadUsersToFollow(); // recarga lista
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", loadUsersToFollow);


