// notifications.js
async function loadNotifications() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Traer notificaciones del backend
    const res = await fetch("/api/v1/notifications", {
      headers: { "Authorization": "Bearer " + token }
    });
    const notifications = await res.json();

    const container = document.getElementById("notifications-list");
    container.innerHTML = ""; // limpiar contenedor

    if (!notifications.length) {
      container.innerHTML = "<p>No hay notificaciones 😴</p>";
      return;
    }

    notifications.forEach(n => {
      const div = document.createElement("div");
      div.classList.add("notification-item");
      div.innerHTML = `
        <p>${n.message}</p>
        <span class="timestamp">${new Date(n.createdAt).toLocaleString()}</span>
        <button class="delete-btn">🗑️</button>
      `;

      // Marcar como leída al hacer click en el div (excepto el botón eliminar)
      div.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) return;
        await fetch(`/api/v1/notifications/${n._id}/read`, {
          method: "PUT",
          headers: { "Authorization": "Bearer " + token }
        });
        loadNotifications(); // recarga
      });

      // Botón eliminar
      div.querySelector(".delete-btn").addEventListener("click", async () => {
        if (!confirm("¿Eliminar notificación? 🗑️")) return;
        await fetch(`/api/v1/notifications/${n._id}`, {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + token }
        });
        loadNotifications(); // recarga
      });

      // Estilo si está leída o no
      if (n.read) div.style.opacity = 0.6;

      container.appendChild(div);
    });

  } catch (error) {
    console.error("Error al cargar notificaciones:", error);
    document.getElementById("notifications-list").innerHTML = "<p>Error al cargar notificaciones 😢</p>";
  }
}

// Ejecutar al cargar profile
document.addEventListener("DOMContentLoaded", loadNotifications);
