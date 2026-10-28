import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FavouriteButton from "../components/FavouriteButton.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";
import { useMenu } from "../context/MenuContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, handleImageError } from "../utils.js";

export default function ItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, currency, status, error, retry, favourites, toggleFavourite } = useMenu();
  const { addItem, count } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorMessage message={error} onRetry={retry} />;

  const item = items.find((i) => String(i.id) === id);

  if (!item) {
    return (
      <div className="empty" role="status">
        <p className="empty__title">We couldn't find that dish</p>
        <p>It may have sold out or been removed from today's menu.</p>
        <Link to="/" className="btn btn--primary">
          Back to the menu
        </Link>
      </div>
    );
  }

  function handleAdd() {
    addItem(item, qty);
    setAdded(true);
    setQty(1);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="detail">
      <button type="button" className="back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail__layout">
        <div className="detail__media">
          <img src={item.image} alt={item.name} onError={handleImageError} />
          <div className="detail__fav">
            <FavouriteButton
              active={favourites.includes(item.id)}
              onToggle={() => toggleFavourite(item.id)}
              name={item.name}
            />
          </div>
        </div>

        <div className="detail__info">
          <p className="card__category">{item.category}</p>
          <h1 className="detail__title">{item.name}</h1>
          <p className="detail__price">{formatPrice(item.price, currency)}</p>
          <p className="detail__desc">{item.description}</p>

          <ul className="facts">
            <li>
              <strong>{item.prepMinutes} min</strong>
              <span>Prep time</span>
            </li>
            <li>
              <strong>{item.calories}</strong>
              <span>Calories</span>
            </li>
            <li>
              <strong>{item.veg ? "Veg" : "Non-veg"}</strong>
              <span>Diet</span>
            </li>
          </ul>

          {item.tags && item.tags.length > 0 && (
            <ul className="tags" aria-label="Tags">
              {item.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}

          <div className="buy">
            <div className="stepper" role="group" aria-label="Quantity">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button
              type="button"
              className={`btn btn--primary ${added ? "btn--done" : ""}`}
              onClick={handleAdd}
            >
              {added ? "Added to cart ✓" : `Add to cart · ${formatPrice(item.price * qty, currency)}`}
            </button>
          </div>

          <p className="detail__note">
            {count > 0 ? (
              <>
                You have {count} {count === 1 ? "item" : "items"} in your cart. <Link to="/cart">View cart →</Link>
              </>
            ) : (
              "Your cart is empty — add this dish to get started."
            )}
          </p>
        </div>
      </div>
    </article>
  );
}
