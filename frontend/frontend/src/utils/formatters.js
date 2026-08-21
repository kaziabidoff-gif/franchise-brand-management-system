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
