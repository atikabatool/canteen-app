import { useMemo, useState } from "react";
import MenuList from "../components/MenuList.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";
import { useMenu } from "../context/MenuContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function MenuPage() {
  const { menu, items, categories, currency, status, error, retry, favourites, toggleFavourite } = useMenu();
  const { lines, addItem } = useCart();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [onlyFavourites, setOnlyFavourites] = useState(false);

  const cartQtyById = useMemo(() => {
    const map = {};
    lines.forEach((l) => {
      map[l.id] = l.qty;
    });
    return map;
  }, [lines]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (onlyFavourites && !favourites.includes(item.id)) return false;
      if (!q) return true;
      const haystack = [item.name, item.description, item.category, ...(item.tags || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, category, onlyFavourites, favourites]);

  const hasFilters = query !== "" || category !== "All" || onlyFavourites;

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setOnlyFavourites(false);
  }

  return (
    <>
      <section className="hero">
        <p className="hero__eyebrow">Today's menu</p>
        <h1 className="hero__title">{menu && menu.tagline ? menu.tagline : "Fresh plates for hungry minds"}</h1>
        <p className="hero__sub">
          Browse, favourite and build your order in a few taps — then skip the queue.
        </p>
      </section>

      {status === "loading" && <Loading />}
      {status === "error" && <ErrorMessage message={error} onRetry={retry} />}

      {status === "ready" && (
        <section aria-label="Menu">
          <div className="filters">
            <label className="search">
              <span className="sr-only">Search the menu</span>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search dishes, e.g. “biryani”"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <div className="chips" role="group" aria-label="Filter by category">
              {["All", ...categories].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip ${category === c ? "chip--on" : ""}`}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
              <button
                type="button"
                className={`chip chip--fav ${onlyFavourites ? "chip--on" : ""}`}
                aria-pressed={onlyFavourites}
                onClick={() => setOnlyFavourites((v) => !v)}
              >
                ♥ Favourites{favourites.length > 0 ? ` (${favourites.length})` : ""}
              </button>
            </div>
          </div>

          <p className="result-count" role="status" aria-live="polite">
            Showing {visible.length} of {items.length} dishes
            {hasFilters && (
              <button type="button" className="link-btn" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </p>

          <MenuList
            items={visible}
            currency={currency}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
            onAdd={(item) => addItem(item, 1)}
            cartQtyById={cartQtyById}
          />
        </section>
      )}
    </>
  );
}
