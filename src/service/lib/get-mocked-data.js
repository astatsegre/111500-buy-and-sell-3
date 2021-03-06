'use strict';

const {readFile} = require(`fs`).promises;

const {PATH_TO_MOCKS, CATEGORY_FILE} = require(`../constants`);
const {getArrayFromFile} = require(`../utils`);
const logger = require(`./logger`).getLogger({name: `api`});

let data = [];
let categoryList = [];

const getMockedData = async () => {
  if (data.length > 0) {
    return data;
  }
  try {
    const fileContent = await readFile(PATH_TO_MOCKS, `utf8`);
    if (!fileContent) {
      return Promise.reject([]);
    }
    data = JSON.parse(fileContent);
  } catch (e) {
    logger.error(e.message);
    return Promise.reject(e);
  }

  return data;
};

const getMockedCategoryList = async () => {
  if (categoryList.length > 0) {
    return categoryList;
  }
  try {
    categoryList = getArrayFromFile(CATEGORY_FILE);
  } catch (e) {
    logger.error(e.message);
    return Promise.reject(e);
  }
  return categoryList;
};

module.exports = {getMockedData, getMockedCategoryList};
