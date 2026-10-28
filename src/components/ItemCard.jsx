import { useState } from "react";
import { Link } from "react-router-dom";
import FavouriteButton from "./FavouriteButton.jsx";
import { formatPrice, handleImageError } from "../utils.js";

export default function ItemCard({ item, currency, isFavourite, onToggleFavourite, onAdd, inCartQty }) {
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    onAdd(item);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1100);
  }

  return (
    <article className="card">
      <div className="card__media">
        <Link to={`/item/${item.id}`} aria-label={`Open ${item.name}`}>
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={handleImageError}
          />
        </Link>
        <span className={`diet ${item.veg ? "diet--veg" : "diet--non"}`}>
          {item.veg ? "Veg" : "Non-veg"}
        </span>
        <div className="card__fav">
          <FavouriteButton
            active={isFavourite}
            onToggle={() => onToggleFavourite(item.id)}
            name={item.name}
          />
        </div>
      </div>

      <div className="card__body">
        <p className="card__category">{item.category}</p>
        <h3 className="card__title">
          <Link to={`/item/${item.id}`}>{item.name}</Link>
        </h3>
        <p className="card__desc">{item.description}</p>

        <div className="card__footer">
          <span className="price">{formatPrice(item.price, currency)}</span>
          <button
            type="button"
            className={`btn btn--primary btn--sm ${justAdded ? "btn--done" : ""}`}
            onClick={handleAdd}
          >
            {justAdded ? "Added ✓" : inCartQty > 0 ? `Add more (${inCartQty})` : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
