import ItemCard from "./ItemCard.jsx";

export default function MenuList({ items, currency, favourites, onToggleFavourite, onAdd, cartQtyById }) {
  if (items.length === 0) {
    return (
      <div className="empty" role="status">
        <p className="empty__title">Nothing matches your search</p>
        <p>Try a different word, or clear the filters to see the full menu.</p>
      </div>
    );
  }

  return (
    <div className="grid" role="list">
      {items.map((item) => (
        <div role="listitem" key={item.id} className="grid__cell">
          <ItemCard
            item={item}
            currency={currency}
            isFavourite={favourites.includes(item.id)}
            onToggleFavourite={onToggleFavourite}
            onAdd={onAdd}
            inCartQty={cartQtyById[item.id] || 0}
          />
        </div>
      ))}
    </div>
  );
}
