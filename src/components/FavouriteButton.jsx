export default function FavouriteButton({ active, onToggle, name }) {
  return (
    <button
      type="button"
      className={`fav ${active ? "fav--on" : ""}`}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
      title={active ? "Remove from favourites" : "Add to favourites"}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path
          d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.5c0 5.6-7.5 10.2-7.5 10.2Z"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
