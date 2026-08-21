export const titleCase = (value = '') =>
  value
    .toString()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

export const formatDate = (value) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const initials = (name = 'FBMS') =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// Uploaded files come back as relative paths like "/uploads/xyz.png" from the
// backend's static file server, which resolve against the wrong origin
// (the Vite dev server, not the API server) if used as-is in <img src>.
export const resolveFileUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  // Anything that isn't an absolute URL and doesn't start with '/' isn't a
  // real path from our upload system (e.g. junk placeholder text) -- don't
  // try to turn it into a fetchable URL.
  if (!url.startsWith('/')) {
    return null;
  }
  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
  return `${apiOrigin}${url}`;
};

export const isImageUrl = (url = '') => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(url);
