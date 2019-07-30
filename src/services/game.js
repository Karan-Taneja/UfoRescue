import MyDictionary from './dictionary';
import { setItem, getItem } from './cache';

const Game = {};

Game.chooseCodeWord = () => {
  const dict = MyDictionary;
  let index = Math.floor(Math.random() * dict.length);
  let codeword = dict[index].toUpperCase();
  
  return codeword;
}

Game.wordToObject = (codeword) => {
  const cw = {};
  
  for(let i = 0; i < codeword.length; i++){
    const letter = codeword[i];
    
    if(cw[letter]) cw[letter].push(i);
    else {
      cw[letter] = [i];
      cw[letter].guessed = false;
    };
  };

  return cw;
};

Game.getNumberOfUniqueLetters = (cwObj) => {
  let count = 0;
  let keys = Object.keys(cwObj);

  for(let i = 0; i < keys.length; i++){
    count++
  };
  
  return count;
}

Game.generateDisplay = (codeword, cwObj) => {
  let display = '';
  for(let i = 0; i < codeword.length; i++){
    let key = codeword[i]
    let c = '';
    
    if(cwObj[key].guessed === true) c = key;
    else c = '_';

    if(i < codeword.length - 1) c+=' '
    display+=c;
  };

  return display;
};

Game.determineCorrectness = (cwObj, char) => {
  if(cwObj[char]){
    const co = { char }
    co[char] = cwObj[char];
    return co
  }

  else return char;
};

Game.getInitialPossibleWords = (word) => {
  let dict = MyDictionary;
  let possible = [];
  
  for(let i = 0; i < MyDictionary.length; i++){
    if(dict[i].length === word.length){
      possible.push(dict[i]);
    };
  };
  
  setItem('possible', possible);
  return possible.length;
};

Game.getPossibleWordsFromCorrect = (correct) => {
  let dict = getItem('possible');
  let possible = [];
  const char = correct.char;
  
  for(let i = 0; i < dict.length; i++){
    let word = dict[i]
    let valid = true;
    let j = 0;
    while(valid && j < correct[char].length){
      let index = correct[char][j];
      if(word[index] !== char) valid = false;
      j++;
    };
    if(valid) possible.push(word); 
  };

  setItem('possible', possible);
  return possible.length;
};

Game.getPossibleWordsFromIncorrect = (incorrect) => {
  let dict = getItem('possible');
  let possible = [];
  
  for(let i = 0; i < dict.length; i++){
    if(!dict[i].includes(incorrect)){
      possible.push(dict[i])
    };
  };
  
  setItem('possible', possible)
  return possible.length;
};

export default Game;