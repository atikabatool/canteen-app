import { useState } from "react";
import { Link } from "react-router-dom";
import Cart from "../components/Cart.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useMenu } from "../context/MenuContext.jsx";
import { formatPrice } from "../utils.js";

export default function CartPage() {
  const { lines, total, count, setQty, removeItem, clearCart } = useCart();
  const { currency } = useMenu();
  const [receipt, setReceipt] = useState(null);

  function handleCheckout() {
    const orderNo = `LT-${Math.floor(1000 + Math.random() * 9000)}`;
    setReceipt({ orderNo, count, total });
    clearCart();
  }

  if (receipt) {
    return (
      <div className="confirm" role="status">
        <span className="confirm__icon" aria-hidden="true">
          ✓
        </span>
        <h1 className="confirm__title">Order placed</h1>
        <p>
          Your order <strong>{receipt.orderNo}</strong> ({receipt.count}{" "}
          {receipt.count === 1 ? "item" : "items"}, {formatPrice(receipt.total, currency)}) is being prepared.
          Show this number at the counter.
        </p>
        <Link to="/" className="btn btn--primary" onClick={() => setReceipt(null)}>
          Back to the menu
        </Link>
      </div>
    );
  }

  return (
    <section>
      <h1 className="page-title">Your cart</h1>
      <Cart
        lines={lines}
        total={total}
        count={count}
        currency={currency}
        onSetQty={setQty}
        onRemove={removeItem}
        onClear={clearCart}
        onCheckout={handleCheckout}
      />
    </section>
  );
}
