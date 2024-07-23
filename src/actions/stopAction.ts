import { getNetworkController } from '../controllers/networkController.js';
import { clilog } from '../utils/cliLogger.js';
import { logger } from '../utils/logger.js';

export default async function stopAction(
  nodes: string[],
  options: { all: boolean },
) {
  logger.info(
    `Running stop action with nodes ${nodes}, all flag ${options.all}`,
  );
  const network = getNetworkController();
  if (options.all) {
    nodes = network.nodes.map((node) => node.name);
  } else if (nodes.length === 0) {
    clilog.error('Please specify nodes to stop');
  }
  for (const node of nodes) {
    try {
      await network.stopNode(node);
    } catch (err) {
      logger.error(err);
      clilog.stopSpinner(false);
      if (err instanceof Error) {
        clilog.error(err.message);
      } else clilog.error(err as string);
    }
  }
}
