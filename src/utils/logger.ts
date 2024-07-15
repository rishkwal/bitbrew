import pino, {
  Bindings,
  DestinationStream,
  LoggerOptions,
  StreamEntry,
} from 'pino';
import path from 'path';
import { createWriteStream } from 'fs';
import { StateController } from '../controllers/stateController.js';

const stateController = new StateController();

const fileStream: StreamEntry = {
  stream: createWriteStream(path.join(stateController.getLogDir(), 'app.log'), {
    flags: 'a',
  }),
};
const consoleStream: StreamEntry = {
  level: 'info',
  stream: pino.transport({
    target: 'pino-pretty',
    options: { colorize: true },
  }),
};

const logStream = [
  fileStream,
  process.env.LOG_TO_CONSOLE === 'true' ? consoleStream : null,
] as (DestinationStream | StreamEntry)[];

const errorSerializer = (error: Error) => {
  return {
    type: error.name,
    message: error.message,
    stack: error.stack,
  };
};

const logConfig: LoggerOptions = {
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    bindings: (bindings: Bindings) => {
      return { hostname: bindings.hostname };
    },
    level: (label: string) => {
      return { level: label };
    },
  },
  serializers: {
    err: errorSerializer,
  },
  messageKey: 'message',
};

export const logger = pino(logConfig, pino.multistream(logStream));
