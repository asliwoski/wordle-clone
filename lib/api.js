import {
  ANSWER,
  ANSWER_LENGTH,
  BAGEL,
  FERMI,
  MAX_TRY_COUNT,
  PICO,
} from "./constants";

export function isValidInput(state) {
  const regex = new RegExp(`^[A-Za-z]{0,${ANSWER_LENGTH}}$`);
  return (
    Array.isArray(state) &&
    state.length <= MAX_TRY_COUNT &&
    state.every((guess) => regex.test(guess))
  );
}

function normalizeInput(state) {
  return state.map((guess) => guess.toLowerCase());
}

export function processInput(state) {
  return normalizeInput(state).map((guess) => ({
    guess,
    clues: generateClues(guess),
  }));
}

function generateClues(guess) {
  const answerArray = ANSWER.split("");
  const guessArray = guess.split("");
  const letterCounts = answerArray.reduce(
    (acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }),
    {}
  );
  const fermiIndices = guessArray
    .map((letter, index) =>
      letter === ANSWER[index] ? { index, letter } : null
    )
    .filter((value) => value !== null);
  return guessArray.reduce((acc, letter, index) => {
    const clue = { letter };
    const isFermi = fermiIndices.find(
      ({ index: fermiIndex }) => index === fermiIndex
    );
    const picosAndFermisSoFar = acc.filter(
      (previousClue) =>
        letter === previousClue.letter &&
        [PICO, FERMI].includes(previousClue.clue)
    );
    const futureFermis = fermiIndices.filter(
      ({ index: fermiIndex, letter: fermiLetter }) =>
        fermiIndex > index && letter === fermiLetter
    );
    const isPico =
      ANSWER.includes(letter) &&
      picosAndFermisSoFar.length + futureFermis.length < letterCounts[letter];
    clue.clue = isFermi ? FERMI : isPico ? PICO : BAGEL;
    return [...acc, clue];
  }, []);
}
