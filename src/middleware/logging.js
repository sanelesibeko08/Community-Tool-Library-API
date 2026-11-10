function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const timestamp = new Date(startedAt).toISOString();
  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`
    );
  });
  next();
}

module.exports = requestLogger;
