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

// Function to process new log entries and emit events
async function processNewLogEntries(fromPosition: number) {
  const readStream = fs.createReadStream(logFilePath, { encoding: 'utf8', start: fromPosition });
  const rl = readline.createInterface({ input: readStream });

  rl.on('line', (line: string) => {
    console.log('New Log Entry:', line);
    logEmitter.emit('logEntry', line); // Emit event for each log entry
    // Add your logic to parse and process the log entry here
  });

  rl.on('close', () => {
    console.log('Finished processing new log entries.');
  });

  rl.on('error', (err: any) => {
    console.error('Error reading log stream:', err);
  });
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
