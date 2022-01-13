const fs = require('fs/promises');
const path = require('path');

// --------work with all files ------------
const filesPath = path.join(__dirname, 'db', '200k_words_100x100');
// const filesPath = path.join(__dirname, 'db', '2kk_words_400x400');

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
              '200k_words_100x100',
              // '2kk_words_400x400',
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
    const ads = [
      [1, 1, 2, 3, 4],
      [1, 2, 2, 3, 5],
      [1, 2, 3, 3, 6],
      [1, 2, 3, 4, 7],
    ];

    // const sortArr = allWords.flat().slice().sort();
    // ----- находим количество всех словосочетаний ---------------------
    const uniqueValues = [...new Set(allWords.flat())];
    console.log('uniqueValues =', uniqueValues.length); // = 129240

    const existInAllFiles = getUniqueElems(allWords);
    console.log('existInAllFiles =', existInAllFiles.length); // =

    // const qwe = existInAtLeastTen(allWords);
    // console.log('qwe =', qwe.length);
  } catch (error) {
    throw error;
  }
};

getAll();
// ----------------------------------------------------------------------------------------------------------------------------
// функция возвращает масив без дублей [[словосочетания файла-1], [словосочетания файла-2], ...]
async function getOllWords(data) {
  return data.reduce((acc, el) => {
    acc.push([...new Set(el.split('\n'))]);
    return acc;
  }, []);
}
// функция возвращает масив элементов встречающихся 20 раз
function getUniqueElems(ollArr) {
  const arr = ollArr.flat().sort();
  const res = [];

  arr.reduce((acc, word, i, arr) => {
    if (arr[i + 1] === word) {
      acc.push(word);
    }
    if (acc.length === 19) {
      res.push(acc);
      acc.length = 0;
    }
    return acc;
  }, []);
  return res;
}
