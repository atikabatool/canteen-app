import { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from "react";

const CartContext = createContext(null);
const CART_KEY = "canteen-cart";

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { item, qty } = action;
      const existing = state.find((line) => line.id === item.id);
      if (existing) {
        return state.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + qty } : line
        );
      }
      return [
        ...state,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          qty,
        },
      ];
    }
    case "SET_QTY":
      return state
        .map((line) => (line.id === action.id ? { ...line, qty: action.qty } : line))
        .filter((line) => line.qty > 0);
    case "REMOVE":
      return state.filter((line) => line.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

function initCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l) => l && typeof l.id === "number" && l.qty > 0 && typeof l.price === "number"
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, initCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const addItem = useCallback((item, qty = 1) => dispatch({ type: "ADD", item, qty }), []);
  const setQty = useCallback((id, qty) => dispatch({ type: "SET_QTY", id, qty }), []);
  const removeItem = useCallback((id) => dispatch({ type: "REMOVE", id }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  // Count and total are derived from the same state, so the header can never drift
  const { count, total } = useMemo(
    () =>
      lines.reduce(
        (acc, l) => ({ count: acc.count + l.qty, total: acc.total + l.qty * l.price }),
        { count: 0, total: 0 }
      ),
    [lines]
  );

  const value = { lines, count, total, addItem, setQty, removeItem, clearCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
