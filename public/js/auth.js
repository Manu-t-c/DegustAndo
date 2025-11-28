// api.js
window.API_BASE = "https://degustando-production.up.railway.app";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${window.API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${res.status}`);
  }
  return res.json();
}

async function apiFetchAuth(path, opts = {}) {
  if (window.apiFetch) return window.apiFetch(path, opts);
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers.Authorization = "Bearer " + token;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  return res;
}

document.addEventListener("DOMContentLoaded", () => {

  // -------- LOGIN --------
  const btnLogin = document.getElementById("btnLogin");
  if (btnLogin) {
    btnLogin.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      if (!email || !password) return document.getElementById("loginMsg").innerText = "Completa los campos";

      try {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) return document.getElementById("loginMsg").innerText = data.message || "Error";

        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        updateNavbar();
        window.location.href = "/index.html";
      } catch (e) {
        document.getElementById("loginMsg").innerText = "Error de red";
      }
    });
  }

  // -------- REGISTER --------
  const btnRegister = document.getElementById("btnRegister");
  if (btnRegister) {
    btnRegister.addEventListener("click", async () => {
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPass").value;
      if (!username || !email || !password) return document.getElementById("regMsg").innerText = "Completa los campos";

      try {
        const res = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) return document.getElementById("regMsg").innerText = data.message || "Error";

        const loginRes = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("currentUser", JSON.stringify(loginData.user));
          updateNavbar();
          window.location.href = "/index.html";
        } else {
          document.getElementById("regMsg").innerText = "Registrado. Inicia sesión.";
          window.location.href = "/login.html";
        }
      } catch (e) { document.getElementById("regMsg").innerText = "Error de red"; }
    });
  }

  // -------- NAVBAR DYNAMIC --------
  function updateNavbar() {
    const token = localStorage.getItem("token");
    const authLink = document.getElementById("authLink");
    const btnLogout = document.getElementById("btnLogout");

    if (!authLink) return;

    if (token) {
      authLink.innerText = "Perfil";
      authLink.href = "/profile.html";
      if (btnLogout) btnLogout.style.display = "inline-block";
    } else {
      authLink.innerText = "Ingresar";
      authLink.href = "/login.html";
      if (btnLogout) btnLogout.style.display = "none";
    }
  }

  // -------- LOGOUT --------
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      updateNavbar();
      window.location.href = "/index.html";
    });
  }

  // Ejecutar al cargar la página
  updateNavbar();

});






