import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { EventEmitter } from 'events';

// Use fs.promises to handle async file system operations
const fsPromises = fs.promises;

// Path to the log file in the shared volume
const logFilePath = path.resolve('/app/logs/ecommerce.log');

// Track the last file size to read only new lines
let lastFileSize = 0;

// Create an EventEmitter instance
const logEmitter = new EventEmitter();

// Configurable time interval (in milliseconds)
export const TIME_INTERVAL = .5 * 60 * 1000; // 5 minutes (you can change this as needed)

// Cache for accumulating logs
let accumulatedLogs: string[] = [];

// Function to process new log entries and accumulate them
async function processNewLogEntries(fromPosition: number) {
  const readStream = fs.createReadStream(logFilePath, { encoding: 'utf8', start: fromPosition });
  const rl = readline.createInterface({ input: readStream });

  rl.on('line', (line: string) => {
    // console.log('New Log Entry:', line);
    accumulatedLogs.push(line); // Accumulate logs
  });

  rl.on('close', () => {
    // console.log('Finished processing new log entries.');
  });

  rl.on('error', (err: any) => {
    console.error('Error reading log stream:', err);
  });
}

// Function to emit accumulated logs after each interval
function emitLogsAtInterval() {
  setInterval(() => {
    if (accumulatedLogs.length > 0) {
      console.log(`Emitting ${accumulatedLogs.length} logs...`);
      logEmitter.emit('logInterval', accumulatedLogs); // Emit accumulated logs as a batch
      accumulatedLogs = []; // Reset accumulated logs after emitting
    }
  }, TIME_INTERVAL);
}

// Function to check if the log file exists
async function checkFileExists(filePath: string): Promise<void> {
  try {
    await fsPromises.access(filePath, fs.constants.F_OK);
    console.log(`File ${filePath} exists.`);
  } catch (error) {
    console.log(`${filePath} does not exist. Retrying in 2 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 2000));  // Wait for 2 seconds
    await checkFileExists(filePath);  // Recursively retry
  }
}

// Function to watch the log file for changes
export async function watchLogFile() {
  // First, check if the file exists before trying to watch it
  await checkFileExists(logFilePath);

  console.log(`Watching log file: ${logFilePath}`);

  // Initialize the last file size when the program starts
  try {
    const stats = await fsPromises.stat(logFilePath);
    lastFileSize = stats.size;
  } catch (err) {
    console.error('Error initializing log file watcher:', err);
  }

  // Start the time interval to emit logs every n minutes
  emitLogsAtInterval();

  // Watch the log file for changes
  fs.watch(logFilePath, async (eventType) => {
    if (eventType === 'change') {
      try {
        const stats = await fsPromises.stat(logFilePath);
        if (stats.size > lastFileSize) {
          // New data has been added, process only new lines
          await processNewLogEntries(lastFileSize);
          lastFileSize = stats.size; // Update the last known file size
        }
      } catch (err) {
        console.error('Error reading log file stats:', err);
      }
    }
  });

  return logEmitter; // Return the EventEmitter instance
}
