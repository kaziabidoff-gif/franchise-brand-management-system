const { query } = require('../config/db');

const findAll = () => query('SELECT id, name, slug, description FROM roles ORDER BY id ASC');

module.exports = { findAll };
