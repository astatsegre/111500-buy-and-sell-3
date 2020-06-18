'use strict';

const fs = require(`fs`);
const {version} = require(`../../package.json`);
const constants = require(`./constants`);
const {getRandomNumber} = require(`./utils`);

// const argv = process.argv;
const [commandName = ``, commandValue = null] = process.argv.slice(2);

const runCommand = (name, value) => {
  switch (name) {
    case `--generate`:
      generateOffer(value);
      break;
    case `--version`:
      showVersion();
      break;
    default:
      showHelp();
  }
};

const showHelp = () => {
  console.log(constants.helpText);
};

const showVersion = () => {
  console.log(`v${version}`);
};

const generateOffer = (value) => {
  const objectInArrayNumber = Number.parseInt(value, 10) || constants.DEFAULT_NUMBER;
  if (objectInArrayNumber > constants.MAX_COUNT) {
    console.log(`Не больше 1000 объявлений`);
    process.exit(1);
  }
  const resultArray = [];
  for (let i = 0; i < objectInArrayNumber; i++) {
    resultArray.push(generateMockedObject());
  }
  fs.writeFile(`./mock.json`, JSON.stringify(resultArray), (err) => {
    if (err) {
      process.exit(1);
    }
    process.exit(0);
  });
};

const randomSliceArray = (arrayName, maxLength) => {
  const start = getRandomNumber(0, constants[arrayName].length - 1);
  const end = getRandomNumber(start + 1, maxLength ? start + 1 + maxLength : constants[arrayName].length);
  return constants[arrayName].slice(start, end);
};

const generateMockedObject = () => {
  return {
    title: constants.titleList[getRandomNumber(0, constants.titleList.length)],
    picture: `item${getRandomNumber(constants.PICTURE_NUMBER_MIN, constants.PICTURE_NUMBER_MAX)}.jpg`,
    description: randomSliceArray(`descriptionList`, constants.SENTENCES_IN_DESCRIPTION_MAX),
    type: constants.typeList[getRandomNumber(0, constants.typeList.length)],
    sum: getRandomNumber(constants.SUM_MIN, constants.SUM_MAX),
    category: randomSliceArray(`categoryList`)
  };
};

runCommand(commandName, commandValue);
