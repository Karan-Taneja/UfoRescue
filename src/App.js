import React, { useState, useEffect } from 'react';

// ------ Data
import UFO from './services/ufo';

// ------ Services
import { removeItem } from './services/cache';
import Game from './services/game';

// ------ CSS
import './App.css';

const App = () => {
  
  // ---- Game useState functions
  // **** Word
  const [codeword, setCodeword] = useState('');
  const [codewordObj, setCodewordObj] = useState({});
  const [wordDisplay, setWordDisplay] = useState('');
  const [possibleWords, setPossibleWords] = useState(0);

  // **** Guess
  const [correct, setCorrect] = useState([]);
  const [correctObj, setCorrectObj] = useState({});
  const [incorrect, setIncorrect] = useState([]);
  const [message, setMessage] = useState('Take a guess!')
  const [ufo, setUfo] = useState(UFO[0]);
  
  // **** Game State
  const [gameState, setGameState] = useState(0);
  
  // ---- User useState functions
  // **** Input
  const [input, setInput] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if(incorrect.length < 6){
      if(incorrect.length > 0){
        const last = incorrect.length - 1;
        const possible = Game.getPossibleWordsFromIncorrect(incorrect[last])
        setPossibleWords(possible);
        setMessage('Incorrect! The tractor beam pulls the person in further!')
      };
      setUfo(UFO[incorrect.length]);
    } else {
      setUfo(UFO[incorrect.length])
      setGameState(3);
    };
  }, [incorrect]);

  useEffect(() => {
    if(correct.length > 0){
      const display = Game.generateDisplay(codeword, codewordObj)
      const possible = Game.getPossibleWordsFromCorrect(correctObj);
      const possCorrect = Game.getNumberOfUniqueLetters(codewordObj);
      setMessage("Correct! You're closer to cracking the codeword.")
      setPossibleWords(possible);
      setWordDisplay(display);
      if(correct.length === possCorrect && gameState === 1) setGameState(2);
    };
  }, [correct, correctObj, codeword, codewordObj, gameState]);

  // ---- Handlers

  const startGame = (e) => {
    if(gameState === 3) removeItem('possible');
    
    let codeword = Game.chooseCodeWord();
    const possible = Game.getInitialPossibleWords(codeword);
    const codewordObj = Game.wordToObject(codeword);
    let display = Game.generateDisplay(codeword, codewordObj);
    
    setCodeword(codeword);
    setCodewordObj(codewordObj);
    setWordDisplay(display);
    setPossibleWords(possible);
    setGameState(1);
  };

  const handleInput = (e) => {
    e.preventDefault();
    const nuInput = e.target.value.toUpperCase();
    const code = nuInput.charCodeAt(0);
    
    if(input.length < 1){
      if(code >= 65 && code <= 90){
        setInput(nuInput)
        setErr('');
      } else {
        setErr('Invalid character entered.')
      }
    } else {
      if(nuInput.length >= 1){
        setErr('You can only guess on character at a time');
      } else {
        setInput(nuInput);
      };
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(input.length > 1){
      setInput('')
      setErr('Invalid input, try again.');
    }
    else if(incorrect.includes(input) || correct.includes(input)){
      setInput('')
      setErr('You already guessed that letter.');
    }
    else {
      const result = Game.determineCorrectness(codewordObj, input);
      const call = typeof result;
      if(call === 'string'){
        setInput('')
        setMessage('')
        setIncorrect(incorrect.concat([result]));
      } else if(call === 'object'){
        codewordObj[result.char].guessed = true;
        setInput('')
        setCorrect(correct.concat([result.char]));
        setCorrectObj(result);
        setCodewordObj(codewordObj);
      };
    };
  };

  // ---- JSX

  return (
    <div className="App">
      { gameState === 0 ?
        <div className="display">
          <h2>WELCOME TO OPERATION UFO RESCUE</h2>
          <div>
            <h3>DEBRIEF:</h3>
            <p>To save the civilian you must deciper the UFO shutdown codeword.</p>
            <p>You must guess letters one at a time to decipher the codeword.</p>
            <p>Mistakes will cause the tractor beam to pull the civilian further.</p>
            <p>Successfully decipher the codeword to disable the UFO.</p>
            <p>Click <b>Start</b> when you are ready to begin.</p>
          </div>
          <button className="button" type="button" onClick={startGame}>Start</button>
        </div>
        :
        <div className="full">
        { gameState === 1 ?
          <div className="display">
            {
            err.length > 0 ?
            <div className="err">
              {`Error: ${err}`}
            </div>
            :
            <p>{message}</p>
            }
          </div>
          :
          gameState === 2 ?
          <div className="display">
            <p>You saved the civilian and earned a medal of honor!</p>
            <button className="button" type="button" onClick={startGame}>Play again?</button>
          </div>
          :
          <div className="display">
            <p>Mission Failed: The civilian was abducted by the UFO. The Codeword was {codeword}.</p>
            <button className="button" type="button" onClick={startGame}>Play again?</button>
          </div>
        }
          <div className="display full">
            {wordDisplay}
            <p>Incorrect Guesses: </p>
            <p style={{height: '16px'}}>
            {
              incorrect.length > 0 ?
              `${incorrect.join(" ")}`
              :
              ''
            }
            </p>
            <div className="display full">
              <p>Possible Words: {possibleWords}</p>
            </div>
          </div>
          <pre className="ufo">
            <code>
              {
                `${ufo}`
              }
            </code>
          </pre>
          {gameState === 1 ?
          <form className="form-group">
            <div className='form-control'>
              <input 
                type="text"
                className="guess"
                value={input} 
                onChange={handleInput}
                id="input--guess"
                />
              <button className="button submit" type="button" onClick={handleSubmit}>Guess</button>
            </div>
          </form>
          :
          <></>
          }
        </div> 
      }
    </div> 
  );
}

export default App;