import { Link } from "react-router-dom";
import { formatPrice, handleImageError } from "../utils.js";

export default function Cart({ lines, total, count, currency, onSetQty, onRemove, onClear, onCheckout }) {
  if (lines.length === 0) {
    return (
      <div className="empty" role="status">
        <p className="empty__title">Your cart is empty</p>
        <p>Pick something delicious from today's menu and it will appear here.</p>
        <Link to="/" className="btn btn--primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <ul className="cart__lines">
        {lines.map((line) => (
          <li key={line.id} className="line">
            <Link to={`/item/${line.id}`} className="line__thumb">
              <img src={line.image} alt="" onError={handleImageError} />
            </Link>
            <div className="line__info">
              <Link to={`/item/${line.id}`} className="line__name">
                {line.name}
              </Link>
              <span className="line__unit">{formatPrice(line.price, currency)} each</span>
            </div>

            <div className="stepper" role="group" aria-label={`Quantity of ${line.name}`}>
              <button
                type="button"
                onClick={() => onSetQty(line.id, line.qty - 1)}
                aria-label={`Decrease ${line.name}`}
              >
                −
              </button>
              <span aria-live="polite">{line.qty}</span>
              <button
                type="button"
                onClick={() => onSetQty(line.id, line.qty + 1)}
                aria-label={`Increase ${line.name}`}
              >
                +
              </button>
            </div>

            <span className="line__total">{formatPrice(line.price * line.qty, currency)}</span>
            <button
              type="button"
              className="line__remove"
              onClick={() => onRemove(line.id)}
              aria-label={`Remove ${line.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <aside className="summary" aria-label="Order summary">
        <h2 className="summary__title">Order summary</h2>
        <dl className="summary__rows">
          <div>
            <dt>Items</dt>
            <dd>{count}</dd>
          </div>
          <div className="summary__total">
            <dt>Total</dt>
            <dd data-testid="cart-total">{formatPrice(total, currency)}</dd>
          </div>
        </dl>
        <button type="button" className="btn btn--primary btn--block" onClick={onCheckout}>
          Place order
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onClear}>
          Clear cart
        </button>
      </aside>
    </div>
  );
}
