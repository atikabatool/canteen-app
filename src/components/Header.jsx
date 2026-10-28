import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useMenu } from "../context/MenuContext.jsx";

export default function Header() {
  const { count } = useCart();
  const { menu } = useMenu();
  const name = menu && menu.canteen ? menu.canteen : "Lavender Table";

  return (
    <header className="header">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="header__inner">
        <Link to="/" className="brand" aria-label={`${name} — home`}>
          <span className="brand__mark" aria-hidden="true">
            ✿
          </span>
          <span className="brand__name">{name}</span>
        </Link>

        <nav className="nav" aria-label="Main">
          <NavLink to="/" end className="nav__link">
            Menu
          </NavLink>
          <NavLink to="/cart" className="nav__link nav__cart" aria-label={`Cart, ${count} items`}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path
                d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20 8H6.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="19.5" r="1.4" fill="currentColor" />
              <circle cx="17" cy="19.5" r="1.4" fill="currentColor" />
            </svg>
            <span className="nav__cart-label">Cart</span>
            <span className="badge" data-testid="cart-count" aria-live="polite">
              {count}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
