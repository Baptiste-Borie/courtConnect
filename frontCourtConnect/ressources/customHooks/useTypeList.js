import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const routeMap = {
  filet: "getAllTypeFilet",
  panier: "getAllTypePanier",
  sol: "getAllTypeSol",
};

const useTypeList = (type) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const route = routeMap[type];
    if (!route) {
      console.warn(`Type "${type}" non reconnu dans useTypeList`);
      return;
    }

    const fetchTypes = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await fetch(
          `https://courtconnect.alwaysdata.net/api/${route}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(`Erreur lors du chargement des types ${type} :`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [type]);

  return { items, loading };
};

export default useTypeList;
