document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const feed = document.getElementById("feed");

  try {
    const posts = await apiFetch("/posts"); // tu endpoint de posts

    if (!posts.length) {
      feed.innerHTML = "<p>No hay publicaciones aún 🍔</p>";
      return;
    }

    posts.forEach(post => {
      const card = document.createElement("article");
      card.className = "post-card";

      card.innerHTML = `
        <div class="post-header">
          <img src="${post.user?.avatar || 'https://i.imgur.com/8Km9tLL.png'}" alt="avatar">
          <div>
            <strong>${post.user?.username || "Usuario"}</strong><br>
            <small>${new Date(post.createdAt).toLocaleString()}</small>
          </div>
        </div>
        <img src="${post.image || 'https://placehold.co/600x400'}" class="post-img" alt="comida">
        <div class="post-body">
          <p>${post.description}</p>
        </div>
        <div class="post-actions">
          <button class="like-btn ${post.likedByUser ? 'liked' : ''}" data-id="${post._id}">
            ❤️ <span>${post.likesCount || 0}</span>
          </button>
        </div>
      `;

      feed.appendChild(card);

      // --- Sección de comentarios ---
      const commentsSection = document.createElement("div");
      commentsSection.className = "comments-section";
      commentsSection.innerHTML = `
        <div class="comments-list" id="comments-${post._id}"></div>
        <input type="text" class="comment-input" data-id="${post._id}" placeholder="Escribe un comentario...">
        <button class="comment-btn" data-id="${post._id}">Comentar</button>
      `;
      card.appendChild(commentsSection);

      const commentsList = card.querySelector(`#comments-${post._id}`);

      // Cargar comentarios existentes
      apiFetch(`/comments?parentType=post&parentId=${post._id}`)
        .then(res => {
          res.items.forEach(c => {
            const commentEl = document.createElement("p");
            commentEl.innerHTML = `<strong>${c.userId.username || 'Usuario'}:</strong> ${c.text}`;
            commentsList.appendChild(commentEl);
          });
        })
        .catch(err => console.error("Error cargando comentarios:", err));

      // Agregar nuevo comentario
      const commentBtn = card.querySelector(".comment-btn");
      const commentInput = card.querySelector(".comment-input");
      commentBtn.addEventListener("click", async () => {
        const text = commentInput.value.trim();
        if (!text) return;

        try {
          const newComment = await apiFetch("/comments", {
            method: "POST",
            body: JSON.stringify({
              parentType: "post",
              parentId: post._id,
              userId: currentUser._id, // ObjectId real
              text
            })
          });
          const commentEl = document.createElement("p");
          commentEl.innerHTML = `<strong>Tú:</strong> ${newComment.text}`;
          commentsList.appendChild(commentEl);
          commentInput.value = "";
        } catch (err) {
          alert("Error al enviar comentario 😢");
          console.error(err);
        }
      });
    });

    // --- Like listeners ---
    document.querySelectorAll(".like-btn").forEach(btn => {
      btn.addEventListener("click", async e => {
        const button = e.currentTarget;
        const id = button.dataset.id;
        const countEl = button.querySelector("span");

        try {
          await apiFetch("/likes", {
            method: "POST",
            body: JSON.stringify({ postId: id })
          });
          button.classList.toggle("liked");
          let count = parseInt(countEl.textContent);
          button.classList.contains("liked") ? count++ : count--;
          countEl.textContent = count;
        } catch {
          alert("Inicia sesión para dar like ❤️");
        }
      });
    });
     async function loadSuggestedUsers() {
      try {
        const res = await apiFetchAuth("/api/v1/users/suggested"); // endpoint de sugerencias
        const users = await res.json();

        const usersList = document.getElementById("users-list");
        if (!usersList) return; // si no existe el contenedor, no hace nada
        usersList.innerHTML = "";

        users.forEach(user => {
          const div = document.createElement("div");
          div.className = "user-card";
          div.innerHTML = `
            <p>${user.username}</p>
            <button onclick="followUser('${user._id}')">Seguir</button>
          `;
          usersList.appendChild(div);
        });
      } catch (e) {
        console.error("Error cargando usuarios sugeridos:", e);
      }
     }
     window.followUser = async function(userId) {
  try {
    const res = await apiFetchAuth("/api/v1/follows", {
      method: "POST",
      body: JSON.stringify({ followId: userId }),
      headers: { "Content-Type": "application/json" } // opcional si apiFetchAuth ya lo agrega
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error al seguir usuario:", data.message || data);
      return;
    }

    // Recargar lista de sugeridos solo si se sigue correctamente
    loadSuggestedUsers();
  } catch (e) {
    console.error("Error al seguir usuario:", e);
  }
}

  } catch (err) {
    console.error(err);
    feed.innerHTML = "<p>Error al cargar publicaciones 😢</p>";
  }
});


