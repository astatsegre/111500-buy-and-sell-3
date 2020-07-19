'use strict';

const {readFile} = require(`fs`).promises;
const path = require(`path`);

const chalk = require(`chalk`);
const express = require(`express`);

const DEFAULT_PORT = 3000;
const HTTP_NOT_FOUND_CODE = 404;
const HTTP_SERVER_ERROR = 500;

const app = express();

app.use(express.json());

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await readFile(path.resolve(__dirname, `../mock.json`), `utf8`);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (e) {
    if (e && e.code === `ENOENT`) {
      res.json([]);
      return;
    }
    console.log(chalk.red(e));
    res.status(HTTP_SERVER_ERROR).send(e);
  }
});

app.use((req, res) => {
  res.status(HTTP_NOT_FOUND_CODE).send(`Not found`);
});

const runServer = (userPort) => {
  const port = userPort || DEFAULT_PORT;
  app.listen(port, () => {
    console.log(`Слушаю на порту ${port}`);
  });
};

module.exports = runServer;
