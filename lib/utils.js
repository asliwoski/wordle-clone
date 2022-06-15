import { BAGEL, FERMI, PICO } from "./constants";

export async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export function colorFromClue(clue) {
  switch (clue) {
    case PICO:
      return "#d0b419";
    case FERMI:
      return "#25b525";
    case BAGEL:
      return "gray";
    default:
      return "transparent";
  }
}
