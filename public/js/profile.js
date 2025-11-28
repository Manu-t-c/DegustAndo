document.addEventListener("DOMContentLoaded", async () => {
  const userPostsContainer = document.getElementById("userPosts");

  try {
    // Traemos solo los posts del usuario logueado
    const posts = await apiFetch("/posts/me");

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
          await apiFetch(`/posts/${post._id}`, { method: "DELETE" });
          card.remove(); // eliminar del DOM
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

