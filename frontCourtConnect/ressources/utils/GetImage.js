import { authFetch } from "./AuthFetch";

const defaultTerrainImage =
  "https://courtconnect.alwaysdata.net/uploads/terrains/Default/image.jpg";

export const getTerrainImageUri = async (terrainId) => {
  if (!terrainId) return defaultTerrainImage;

  try {
    const res = await authFetch(`api/terrain/${terrainId}/getPicture`);
    const data = await res.json();

    if (res.ok && data?.imageUrl) {
      return `https://courtconnect.alwaysdata.net${data.imageUrl}`;
    }
  } catch (e) {
    console.error("Erreur lors de la récupération de l'image du terrain :", e);
  }

  return defaultTerrainImage;
};
