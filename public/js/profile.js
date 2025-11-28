document.addEventListener("DOMContentLoaded", async () => {
  const userPostsContainer = document.getElementById("userPosts");

  try {
    // Asegúrate de usar la ruta completa según tu backend
    const posts = await apiFetch("/api/v1/posts/me");

    if (!posts.length) {
      userPostsContainer.innerHTML = "<p>No tienes publicaciones aún 🍳</p>";
      return;
    }

    posts.forEach(post => {
      const card = document.createElement("article");
      card.className = "post-card";

      card.innerHTML = `
        <img src="${post.image || 'https://placehold.co/600x400'}" class="post-img" alt="comida">
        <div class="post-body">
          <p>${post.description}</p>
        </div>
        <div class="post-actions">
          <button class="delete-btn" data-id="${post._id}">🗑️ Eliminar</button>
        </div>
      `;

      userPostsContainer.appendChild(card);

      // Evento eliminar
      const deleteBtn = card.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", async () => {
        if (!confirm("¿Seguro quieres eliminar este post? 🗑️")) return;

        try {
          await apiFetch(`/api/v1/posts/${post._id}`, { method: "DELETE" });
          card.remove();
        } catch (err) {
          alert("Error al eliminar el post 😢");
          console.error(err);
        }
      });
    });

  } catch (err) {
    console.error(err);
    userPostsContainer.innerHTML = "<p>Error al cargar tus publicaciones 😢</p>";
  }
});


