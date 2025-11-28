const API_URL = "https://degustando-production.up.railway.app";


async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // Aseguramos que existan headers y content-type
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers, // <-- por si en algún fetch agregas otros headers
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    // Si la respuesta no es exitosa, lanza un error con mensaje claro
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}`);
    }

    // Si la respuesta tiene cuerpo JSON, devuélvelo
    return await res.json();
  } catch (err) {
    console.error(" Error en apiFetch:", err.message);
    alert(`Error: ${err.message}`);
    throw err;
  }
}
