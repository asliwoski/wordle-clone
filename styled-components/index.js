import styled from "styled-components";
import { colorFromClue } from "../lib/utils";

export const StyledWordleContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: calc(100vh - 20px);
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: black;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;

  input {
    width: 100%;
    height: 100px;
    padding: 20px;
    font-size: 20px;
    border: none;
    box-sizing: border-box;
  }
`;
export const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  height: 5rem;
  border-bottom: 1px solid gray;

  h1 {
    color: white;
  }
`;
export const StyledGrid = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  justify-content: center;
`;
export const StyledGridRow = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
`;
export const StyledGridSquare = styled.div`
  height: 3rem;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  background-color: ${({ clue }) => colorFromClue(clue)};
  color: white;
  font-weight: bold;
  box-sizing: border-box;
  ${({ clue }) => (clue ? "" : `border: 2px solid gray;`)}
`;
export const StyledKeyboardContainer = styled.div`
  width: 100%;
`;
