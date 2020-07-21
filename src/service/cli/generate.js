'use strict';

const {writeFile, readFile} = require(`fs`).promises;
const os = require(`os`);
const path = require(`path`);

const chalk = require(`chalk`);

const {getRandomNumber, PATH_TO_MOCKS} = require(`../utils`);

const DEFAULT_OBJECTS_NUMBER = 1;
const MAX_COUNT = 1000;
const SENTENCES_IN_DESCRIPTION_MAX = 5;
const PICTURE_NUMBER_MIN = 1;
const PICTURE_NUMBER_MAX = 16;
const SUM_MIN = 1000;
const SUM_MAX = 100000;
const typeList = [
  `offer`,
  `sale`
];
const TEXTS_FOLDER = `../../../data`;

const generateOffer = async (value) => {
  const objectsInArrayNumber = Number.parseInt(value, 10) || DEFAULT_OBJECTS_NUMBER;
  if (objectsInArrayNumber > MAX_COUNT) {
    console.log(chalk.red(`Не больше 1000 объявлений`));
    process.exit(1);
  }
  const resultArray = [];
  for (let i = 0; i < objectsInArrayNumber; i++) {
    resultArray.push(await generateMockedObject());
  }
  try {
    await writeFile(PATH_TO_MOCKS, JSON.stringify(resultArray));
  } catch (e) {
    console.log(chalk.red(`Ошибка: ${e}`));
    process.exit(1);
  }
  console.log(chalk.green(`Готово!`));
  process.exit(0);
};

const generateMockedObject = async () => {
  const titleList = await getArrayFromFile(`titles.txt`);
  return {
    title: titleList[getRandomNumber(0, titleList.length)],
    picture: `item${getRandomNumber(PICTURE_NUMBER_MIN, PICTURE_NUMBER_MAX)}.jpg`,
    description: await randomSliceArray(`sentences.txt`, SENTENCES_IN_DESCRIPTION_MAX),
    type: typeList[getRandomNumber(0, typeList.length)],
    sum: getRandomNumber(SUM_MIN, SUM_MAX),
    category: await randomSliceArray(`categories.txt`)
  };
};

const randomSliceArray = async (fileName, maxLength) => {
  const list = await getArrayFromFile(fileName);
  const start = getRandomNumber(0, list.length - 1);
  const end = getRandomNumber(start + 1, maxLength ? start + 1 + maxLength : list.length);
  return list.slice(start, end);
};

const getArrayFromFile = async (fileName) => {
  const list = await readFile(path.resolve(__dirname, `${TEXTS_FOLDER}/`, fileName), `utf8`);
  return list.split(os.EOL).filter((i) => i);
};

module.exports = generateOffer;
