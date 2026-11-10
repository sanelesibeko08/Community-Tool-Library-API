const express = require('express');
const { tools, loans, createId } = require('../data/store');
const {
  validationError,
  notFoundError
} = require('../utils/errorResponse');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  return res.status(200).json({ data: loans });
});

router.post('/', (req, res) => {
  const { toolId, dueDate } = req.body || {};
  if (typeof toolId !== 'string' || toolId.trim() === '') {
    const error = validationError('toolId is required and must be a non-empty string');
    return res.status(error.status).json(error.body);
  }

  if (typeof dueDate !== 'string' || Number.isNaN(Date.parse(dueDate))) {
    const error = validationError('dueDate must be a valid ISO 8601 date');
    return res.status(error.status).json(error.body);
  }

  const tool = tools.find((item) => item.id === toolId);
  if (!tool) {
    const error = notFoundError('Tool not found');
    return res.status(error.status).json(error.body);
  }
  if (!tool.available) {
    const error = conflictError('Tool is already on loan');
    return res.status(error.status).json(error.body);
  }

  const loan = {
    id: createId(),
    toolId: tool.id,
    memberId: req.user.sub,
    dueDate: new Date(dueDate).toISOString(),
    returnedAt: null,
    createdAt: new Date().toISOString()
  };
  tool.available = false;
  loans.push(loan);
  return res.status(201).json({ data: loan });
});

router.delete('/:id', (req, res) => {
  const loan = loans.find((item) => item.id === req.params.id);
  if (!loan) {
    const error = notFoundError('Loan not found');
    return res.status(error.status).json(error.body);
  }
  if (loan.returnedAt !== null) {
    const error = validationError('Loan is already closed');
    return res.status(error.status).json(error.body);
  }

  loan.returnedAt = new Date().toISOString().slice(0, 10);
  const tool = tools.find((item) => item.id === loan.toolId);
  if (tool) {
    tool.available = true;
  }
  return res.status(200).json({ data: loan });
});

module.exports = router;
