const parseJson = (value, fallback = []) => {
  if (Array.isArray(value) || typeof value === 'object') {
    return value ?? fallback;
  }

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const toIntArray = (value) => {
  if (Array.isArray(value)) {
    return value.map(Number).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map(Number).filter(Boolean);
  }

  return [];
};

module.exports = { parseJson, toIntArray };
