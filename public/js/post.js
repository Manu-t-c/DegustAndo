// post.js - manejar creación de post
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createPostForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").value.trim();

    const token = localStorage.getItem("token");
    if (!token) return alert("Debes ingresar para publicar");

    try {
      const res = await fetch("/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ description, image })
      });
      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Error creando post");
      }
      alert("Publicado correctamente");
      window.location.href = "/index.html";
    } catch (e) {
      alert("Error de red al publicar");
    }
  });
});
