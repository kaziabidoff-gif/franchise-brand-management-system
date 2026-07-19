const getPagination = (requestQuery) => {
  const page = Math.max(Number(requestQuery.page || 1), 1);
  const limit = Math.min(Math.max(Number(requestQuery.limit || 10), 1), 100);
  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
};

const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.max(Math.ceil(total / limit), 1)
});

module.exports = { getPagination, paginationMeta };
