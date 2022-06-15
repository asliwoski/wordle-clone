import { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import toast from "react-simple-toasts";
import { ANSWER_LENGTH, FERMI, MAX_TRY_COUNT } from "../lib/constants";
import "react-simple-keyboard/build/css/index.css";
import { postData } from "../lib/utils";
import {
  StyledGrid,
  StyledGridRow,
  StyledGridSquare,
  StyledHeader,
  StyledKeyboardContainer,
  StyledWordleContainer,
} from "../styled-components";

const regex = new RegExp(`^[a-zA-Z]*$`);
const toastConfig = { time: 1000, className: "special-toast" };
const rows = new Array(MAX_TRY_COUNT).fill("");
const columns = new Array(ANSWER_LENGTH).fill(null);

export default function IndexPage() {
  const keyboard = useRef();
  const [state, setState] = useState(rows);
  const [index, setIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [clueData, setClueData] = useState({ state: rows });
  const setGuess = (guess) => {
    setState((prev) => {
      const copy = [...prev];
      copy[index] = guess;
      return copy;
    });
  };

  useEffect(() => {
    // a hack to set up the toast container so the toasts work..
    toast("");
  }, []);

  useEffect(() => {
    if (!index) return;
    postData("/api", { state })
      .then((data) => setClueData(data))
      .catch(
        (error) =>
          console.warn(error) && toast("There was a problem. Try refreshing.")
      );
  }, [index]);

  useEffect(() => {
    if (!clueData?.state) return;
    keyboard.current.setInput("");
    const guessData = clueData.state.filter(({ guess }) => guess);
    if (
      guessData.find(({ clues }) => clues.every(({ clue }) => clue === FERMI))
    ) {
      setGameOver(true);
      switch (guessData.length) {
        case 1:
          toast("Unheard of!");
          break;
        case 2:
          toast("Amazing!");
          break;
        case 3:
          toast("Splendid");
          break;
        case 4:
          toast("Great");
          break;
        case 5:
          toast("Good job");
          break;
        case 6:
          toast("That was close!");
          break;
        default:
          console.log("why are we here....", guessData.length);
      }
    } else if (guessData.length === MAX_TRY_COUNT) {
      setGameOver(true);
      toast("Better luck next time");
    }
  }, [clueData]);

  const onChange = (input) => {
    if (gameOver) {
      keyboard.current.setInput("");
      return;
    }
    if (!regex.test(input)) {
      toast("Only letters please", toastConfig);
      return;
    }
    if (input.length > ANSWER_LENGTH) {
      const truncated = state[index].substring(0, ANSWER_LENGTH);
      keyboard.current.setInput(truncated);
      setGuess(truncated);
      return;
    }
    setGuess(input);
  };

  const onKeyPress = (button) => {
    if (gameOver) return;
    if (button === "{enter}") {
      if (state[index].length < ANSWER_LENGTH) {
        toast("Not enough letters", toastConfig);
        return;
      }
      setIndex((prev) => prev + 1);
    }
    if (button === "{backspace}" && state[index].length) {
      keyboard.current.setInput(state[index].substring(0, state[index].length));
    }
  };

  return (
    <StyledWordleContainer>
      <StyledHeader>
        <h1>Wordle Clone</h1>
      </StyledHeader>
      <Grid state={state} clues={clueData?.state} />
      <StyledKeyboardContainer>
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          layoutName="default"
          layout={{
            default: [
              "Q W E R T Y U I O P",
              "A S D F G H J K L",
              "{enter} Z X C V B N M {backspace}",
            ],
          }}
          display={{
            "{enter}": "ENTER",
            "{backspace}": "&larr;",
          }}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </StyledKeyboardContainer>
    </StyledWordleContainer>
  );
}

function Grid({ state, clues }) {
  return (
    <StyledGrid>
      {rows.map((_, index) => (
        <GridRow key={index} state={state[index]} clues={clues?.[index]} />
      ))}
    </StyledGrid>
  );
}

function GridRow({ state, clues }) {
  const letters = (state ?? "").split("");

  return (
    <StyledGridRow>
      {columns.map((_, index) => (
        <GridSquare
          key={index}
          state={letters[index]}
          clue={clues?.clues?.[index]?.clue}
        />
      ))}
    </StyledGridRow>
  );
}

function GridSquare({ state, clue }) {
  return <StyledGridSquare clue={clue}>{state}</StyledGridSquare>;
}
