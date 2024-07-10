import networkController from "../controllers/networkController.js";

export default async function execAction(node: string, command: string): Promise<void> {
  try {
    networkController.execNodeCommand(node, command);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
}
