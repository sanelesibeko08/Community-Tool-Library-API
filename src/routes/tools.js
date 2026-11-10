const express = require('express');
const { tools, createId } = require('../data/store');
const { validationError } = require('../utils/errorResponse');

const router = express.Router();
const categories = new Set(['Power Tools', 'Hand Tools', 'Garden']);
const conditions = new Set(['good', 'fair', 'poor']);

router.get('/', (req, res) => {
  const { available } = req.query;
  if (available !== undefined && available !== 'true' && available !== 'false') {
    const error = validationError('available must be either true or false');
    return res.status(error.status).json(error.body);
  }

  const result = available === undefined
    ? tools
    : tools.filter((tool) => tool.available === (available === 'true'));
  return res.status(200).json({ data: result });
});

router.post('/', (req, res) => {
  const { name, category, condition } = req.body || {};
  if (typeof name !== 'string' || name.trim().length === 0) {
    const error = validationError('name is required and must be a non-empty string');
    return res.status(error.status).json(error.body);
  }
  if (!categories.has(category)) {
    const error = validationError('category must be Power Tools, Hand Tools, or Garden');
    return res.status(error.status).json(error.body);
  }
  if (!conditions.has(condition)) {
    const error = validationError('condition must be good, fair, or poor');
    return res.status(error.status).json(error.body);
  }

  const tool = {
    id: createId(),
    name: name.trim(),
    category,
    condition,
    available: true
  };
  tools.push(tool);
  return res.status(201).json({ data: tool });
});

module.exports = router;
