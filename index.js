const fs = require('fs/promises');
const path = require('path');

// const wordsPath = path.join(__dirname, 'db', '200k_words_100x100', 'out0.txt');
const filesPath = path.join(__dirname, 'db', '200k_words_100x100');

// функция возвращает масив всех словосочетаний
async function getOllWords(data) {
  const allWords = [];
  for (i = 0; i < data.length; i++) {
    const arr = data[i].split('\n');
    allWords.push(arr);
  }
  return allWords.flat();
}

// функция возвращает масив уникальных словосочетаний (встречаются только 1раз)
async function uniqueValues(arr) {
  const arrDuplicates = await duplicates(arr);
  const unicArr = [];
  for (i = 0; i < arr.length; i++) {
    let currentWord = arr[i];
    let wordFound = arrDuplicates.includes(currentWord);
    if (wordFound) {
      unicArr.push(currentWord);
    }
  }
  return unicArr;
}

// функция возвращает масив словосочетаний которые дублируются
function duplicates(arr) {
  const duplicatesArr = [];
  const sortArr = arr.slice().sort();
  for (let i = 0; i < sortArr.length - 1; i++) {
    if (sortArr[i + 1] == sortArr[i]) {
      duplicatesArr.push(sortArr[i]);
    }
  }
  return duplicatesArr;
}

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
              '200k_words_100x100',
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
    const uniqueWords = await uniqueValues(allWords);
    console.log(uniqueWords);
    // ======================== work ==============================
    // const data = await fs
    //   .readFile(wordsPath)
    //   .then(data => data.toString())
    //   .catch(error => error);
    // const arr = data.split('\n');
    // console.log(arr);
    // const uniqueWords = await uniqueValues(arr);
    // console.log(uniqueWords);
    // ============================================================
  } catch (error) {
    throw error;
  }
};

getAll();
