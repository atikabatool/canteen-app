import { createContext, useContext, useEffect, useState, useCallback } from "react";

const MenuContext = createContext(null);
const FAV_KEY = "canteen-favourites";

function readFavourites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [favourites, setFavourites] = useState(readFavourites);

  // Load menu.json from the local public folder
  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      setStatus("loading");
      setError("");
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}menu.json`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`The menu file could not be found (status ${response.status}).`);
        }
        const data = await response.json();
        if (!data || !Array.isArray(data.items)) {
          throw new Error("The menu file is not in the expected format.");
        }
        setMenu(data);
        setStatus("ready");
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong while loading the menu.");
        setStatus("error");
      }
    }

    loadMenu();
    return () => controller.abort();
  }, [attempt]);

  // Persist favourites
  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favourites));
    } catch {
      /* storage unavailable — favourites just last for the session */
    }
  }, [favourites]);

  const toggleFavourite = useCallback((id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const value = {
    menu,
    items: menu ? menu.items : [],
    categories: menu && Array.isArray(menu.categories) ? menu.categories : [],
    currency: menu && menu.currency ? menu.currency : "Rs",
    status,
    error,
    retry,
    favourites,
    toggleFavourite,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside <MenuProvider>");
  return ctx;
}
