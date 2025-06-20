import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://courtconnect.alwaysdata.net/";

export const authFetch = async (url, options = {}) => {
  let token = await AsyncStorage.getItem("token");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(buildUrl(url), options);
  if (response.status === 401) {
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    if (!refreshToken) throw new Error("Pas de refresh token disponible");

    const refreshResponse = await fetch(`${API_URL}token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!refreshResponse.ok) {
      const errorText = await refreshResponse.text();
      console.error("Échec refresh :", refreshResponse.status, errorText);
      await AsyncStorage.removeItem("token");
      throw new Error("Impossible de rafraîchir le token");
    }

    const refreshData = await refreshResponse.json();
    await AsyncStorage.setItem("token", refreshData.token);

    // Réessaye la requête originale avec le nouveau token
    token = refreshData.token;
    options.headers.Authorization = `Bearer ${token}`;
    response = await fetch(`${API_URL}${url}`, options);
  }

  return response;
};

const buildUrl = (path) => {
  return API_URL.replace(/\/$/, "") + "/" + path.replace(/^\/+/, "");
};
