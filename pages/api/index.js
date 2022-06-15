import { isValidInput, processInput } from "../../lib/api";

export default function handler(req, res) {
  const {
    body: { state },
    method,
  } = req;

  switch (method) {
    case "POST":
      if (!isValidInput(state)) {
        res.status(400).end("Could Not Parse Input");
        break;
      }
      // Update or create data in your database
      res.status(200).json({ state: processInput(state) });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
