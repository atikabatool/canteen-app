export function formatPrice(amount, currency = "Rs") {
  return `${currency} ${Number(amount).toLocaleString("en-US")}`;
}

// Soft lavender placeholder shown if a remote photo fails to load
export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#ede9fe'/><stop offset='1' stop-color='#c4b5fd'/>
      </linearGradient></defs>
      <rect width='400' height='300' fill='url(#g)'/>
      <circle cx='200' cy='150' r='46' fill='none' stroke='#7c3aed' stroke-width='6' opacity='.55'/>
      <path d='M170 150h60M200 120v60' stroke='#7c3aed' stroke-width='6' stroke-linecap='round' opacity='.55'/>
    </svg>`
  );

export function handleImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallback === "1") return;
  img.dataset.fallback = "1";
  img.src = FALLBACK_IMAGE;
}
