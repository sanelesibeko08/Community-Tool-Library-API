const app = require('./app');
const config = require('./src/config');

app.listen(config.port, () => {
  console.log(`Server is listening on ${config.port}`);
});
