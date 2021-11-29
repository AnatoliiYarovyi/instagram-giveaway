const fs = require('fs/promises');
const path = require('path');

// ------- work with one file -------------------
// const wordsPath = path.join(__dirname, 'db', '200k_words_100x100', 'out0.txt');

// --------work with all files ------------
// const filesPath = path.join(__dirname, 'db', '200k_words_100x100');
const filesPath = path.join(__dirname, 'db', '2kk_words_400x400');

// функция возвращает масив всех словосочетаний
async function getOllWords(data) {
  const allWords = [];
  for (i = 0; i < data.length; i++) {
    const arr = data[i].split('\n');
    allWords.push(arr);
  }
  return allWords;
}

// ==================================================================================================
async function filterValues(allWords) {
  let unc = [];
  for (let i = 0; i < allWords.length; i++) {
    const sortArr = await allWords[i].slice().sort();
    const uniqueValueCurrentArr = await getUniqueCollocation(sortArr);
    unc.push(uniqueValueCurrentArr);
  }

  const sortArrUnc = unc.flat().sort();
  const uniqueValuesArr = await getUniqueCollocation(sortArrUnc);
  return uniqueValuesArr;
}

// ===================================================================================================
async function getUniqueCollocation(sortArr) {
  const { duplicatesArr } = await duplicates(sortArr);
  const setSortArr = [...new Set(sortArr)];
  const uniqueValuesArr = await uniqueValues(setSortArr, duplicatesArr);
  return uniqueValuesArr;
}

// - функция возвращает масив словосочетаний которые дублируются======================================
function duplicates(sortArr) {
  const duplicatesArr = [];
  for (let i = 0; i < sortArr.length - 1; i++) {
    if (sortArr[i + 1] == sortArr[i]) {
      duplicatesArr.push(sortArr[i]);
    }
  }
  return {
    duplicatesArr: [...new Set(duplicatesArr)],
  };
}

// - функция возвращает масив уникальных словосочетаний (встречаются только 1раз)======================
async function uniqueValues(allCollocation, duplicatesArr) {
  let unicArr = allCollocation;
  for (i = 0; i < duplicatesArr.length; i++) {
    unicArr = await binarySearch(duplicatesArr[i], unicArr);
  }
  return unicArr;
}

// - функция бинарного поиска==========================================================================
async function binarySearch(value, unicArr) {
  let returnArr = unicArr;

  let first = 0;
  let last = returnArr.length - 1;
  let middle;
  let found = false;

  while (found == false && first <= last) {
    middle = Math.floor((first + last) / 2);
    if (returnArr[middle] == value) {
      await returnArr.splice(middle, 1);
      found = true;
      continue;
    } else if (returnArr[middle] > value) {
      last = middle - 1;
    } else if (returnArr[middle] < value) {
      first = middle + 1;
    }
  }
  return returnArr;
}

// ==================================================================================================
const getAll = async () => {
  try {
    const data = await fs
      .readdir(filesPath)
      .then(files => {
        return Promise.all(
          files.map(async filename => {
            let wordsPath = path.join(
              __dirname,
              'db',
              // '200k_words_100x100',
              '2kk_words_400x400',
              filename,
            );
            const dataW = await fs
              .readFile(wordsPath)
              .then(data => data.toString())
              .catch(error => error);
            return dataW;
          }),
        );
      })
      .catch(error => error);
    const allWords = await getOllWords(data);

    const allCollocation = [...new Set(allWords.flat())];
    console.log('allCollocation =', allCollocation.length);

    const uniqueCollocation = await filterValues(allWords);
    console.log('uniqueCollocation =', uniqueCollocation.length);
  } catch (error) {
    throw error;
  }
};

getAll();
