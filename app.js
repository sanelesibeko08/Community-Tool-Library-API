const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('./docs/openapi.json');
const requestLogger = require('./src/middleware/logging');
const errorHandler = require('./src/middleware/errorHandler');
const toolsRouter = require('./src/routes/tools');
const loansRouter = require('./src/routes/loans');
const authRouter = require('./src/routes/auth');
const { notFoundError } = require('./src/utils/errorResponse');

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/api/tools', toolsRouter);
app.use('/api/loans', loansRouter);
app.use('/api/auth', authRouter);
app.use((req, res) => {
  const error = notFoundError('Route not found');
  res.status(error.status).json(error.body);
});
app.use(errorHandler);

module.exports = app;
