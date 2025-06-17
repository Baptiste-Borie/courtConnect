import { useEffect, useState } from "react";

import { authFetch } from "../utils/AuthFetch";

const routeMap = {
  filet: "getAllTypeFilet",
  panier: "getAllTypePanier",
  sol: "getAllTypeSol",
  event: "getAllTypeEvent",
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
        const res = await authFetch(`api/${route}`);

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
