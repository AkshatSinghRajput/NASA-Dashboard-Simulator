require("dotenv").config();

const DEFAULT_PAGE_NUMBER = process.env.DEFAULT_PAGE_NUMBER;
const DEFAULT_LIMIT = process.env.DEFAULT_LIMIT;

async function getPagination(query) {
  let page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  let limit = Math.abs(query.limit) || DEFAULT_LIMIT;
  let skip = (page - 1) * limit;
  return { skip, limit };
}

module.exports = { getPagination };
