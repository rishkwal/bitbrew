import { getNetworkController } from '../controllers/networkController.js';
import { clilog } from '../utils/cliLogger.js';
import { logger } from '../utils/logger.js';

export default async function startAction(
  nodes: string[],
  options: { all: boolean },
): Promise<void> {
  logger.info(
    `Running start action with nodes ${nodes}, all flag ${options.all}`,
  );
  const network = getNetworkController();
  if (nodes.length === 0) {
    if (options.all) {
      nodes = network.nodes.map((node) => node.name);
    } else {
      clilog.error('Please specify nodes to start');
      return;
    }
  }
  for (const node of nodes) {
    try {
      await network.startNode(node);
    } catch (err) {
      logger.error(err);
      clilog.stopSpinner(false);
      if (err instanceof Error) clilog.error(err.message);
      else clilog.error(err as string);
    }
  }
}
