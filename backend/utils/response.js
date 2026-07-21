/**
 * Consistent API response helpers.
 * All API responses follow the same shape:
 *   { success: true, data: ... }  or  { success: false, error: "..." }
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {*} data - Response payload
 * @param {object} [meta] - Optional metadata (pagination, etc.)
 * @param {number} [status=200] - HTTP status code
 */
export function sendSuccess(res, data, meta, status = 200) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable error message
 * @param {number} [status=400] - HTTP status code
 * @param {Array<{field:string,message:string}>} [details] - Structured validation errors
 */
export function sendError(res, message, status = 400, details) {
  const body = { success: false, error: message };
  if (details) body.details = details;
  return res.status(status).json(body);
}
