import { getNetworkController } from '../controllers/networkController.js';
import { clilog } from '../utils/cliLogger.js';
import { logger } from '../utils/logger.js';

export default async function connectAction(
  sourceNode: string,
  targetNodes: string[],
  options: { all: boolean },
): Promise<void> {
  logger.info(
    `Running connect action with source node ${sourceNode} and target nodes ${targetNodes}`,
  );
  try {
    const networkController = getNetworkController();
    if (
      (!options.all && targetNodes.length === 0) ||
      (!options.all && !sourceNode)
    ) {
      clilog.error('Please provide at least one target node to connect to');
      return;
    }
    if (!options.all) {
      await networkController.connectNodes(sourceNode, targetNodes);
    }
    if (options.all) {
      await networkController.connectAllNodes();
    }
  } catch (err) {
    logger.error(err);
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
    return;
  }
}
