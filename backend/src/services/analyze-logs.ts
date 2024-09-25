import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { createObjectCsvWriter } from 'csv-writer';
import { TIME_INTERVAL, watchLogFile } from './watch-logfile';
import csv from 'csv-parser';
import { time } from 'console';

// Define the output paths
const outputDir = path.resolve(__dirname, '../data/output');
const outputFile = path.join(outputDir, 'metrics.csv');
const logFilePath = path.resolve(__dirname, '../data/input/log1.log');

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });  // Create the directory recursively if it doesn't exist
}
 
// Type definition for a log entry
interface LogEntry {
  level: string;
  timestamp: string;
  module: string;
  message: string;
  extra?: any;
}

// Initialize metric counters
const logMetrics = {
  timestamp: '',
  info: 0,
  warning: 0,
  error: 0,
  searchCount: 0,
  searchTerms: {} as Record<string, number>,  // Store search terms and their frequencies
  ordersPlaced: 0,
  ordersCompleted: 0,
  ordersCanceled: 0,
  paymentSuccess: 0,
  paymentFailure: 0,
  revenue: 0,
  cartAdditions: 0,
  cartFailures: 0,
  cartRemovals: 0,
  reviewsSubmitted: 0, // Track reviews
  reviewRatings: {} as Record<number, number>,  // Track reviews by rating
  lowStockWarnings: 0, // Track low stock warnings
  stockUpdates: 0, // Track stock updates
};
let metricsBatchRecords: typeof logMetrics[] = [];

export const csvFileHeaders = [
  { id: 'timestamp', title: 'TIMESTAMP' },
  { id: 'info', title: 'INFO_COUNT' },
  { id: 'warning', title: 'WARNING_COUNT' },
  { id: 'error', title: 'ERROR_COUNT' },
  { id: 'searchCount', title: 'SEARCH_COUNT' },
  { id: 'topSearchTerms', title: 'TOP_SEARCH_TERMS' },
  { id: 'ordersPlaced', title: 'ORDERS_PLACED' },
  { id: 'ordersCompleted', title: 'ORDERS_COMPLETED' },
  { id: 'ordersCanceled', title: 'ORDERS_CANCELED' },
  { id: 'paymentSuccess', title: 'PAYMENT_SUCCESS' },
  { id: 'paymentFailure', title: 'PAYMENT_FAILURE' },
  { id: 'revenue', title: 'TOTAL_REVENUE' },
  { id: 'cartAdditions', title: 'CART_ADDITIONS' },
  { id: 'cartFailures', title: 'CART_FAILURES' },
  { id: 'cartRemovals', title: 'CART_REMOVALS' },
  { id: 'reviewsSubmitted', title: 'REVIEWS_SUBMITTED' },
  { id: 'reviewRatings', title: 'REVIEW_RATINGS' },
  { id: 'lowStockWarnings', title: 'LOW_STOCK_WARNINGS' },
  { id: 'stockUpdates', title: 'STOCK_UPDATES' },
]

// Initialize the CSV writer for writing metrics output.
// const csvWriter = createObjectCsvWriter({
//   path: outputFile,
//   header: csvFileHeaders,
// });

// Function to write or append to CSV with header logic
async function appendCsvRecord(records: typeof logMetrics[]) {
  // Ensure the directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if the file exists and is non-empty
  const isEmptyFile = fs.existsSync(outputFile) && fs.statSync(outputFile).size === 0;

  // Re-initialize the CSV writer each time with headers
  const csvWriter = createObjectCsvWriter({
    path: outputFile,
    header: csvFileHeaders, // Your headers
    append: !isEmptyFile,   // Append only if the file is non-empty
  });

  // Map the batch of records, transforming any complex fields into strings
  const formattedRecords = records.map((logMetric) => {
    return {
      timestamp: logMetric.timestamp,
      info: logMetric.info,
      warning: logMetric.warning,
      error: logMetric.error,
      searchCount: logMetric.searchCount,
      topSearchTerms: Object.entries(logMetric.searchTerms)
        .map(([term, count]) => `${term}: ${count}`)
        .join(', '), // Convert object to string
      ordersPlaced: logMetric.ordersPlaced,
      ordersCompleted: logMetric.ordersCompleted,
      ordersCanceled: logMetric.ordersCanceled,
      paymentSuccess: logMetric.paymentSuccess,
      paymentFailure: logMetric.paymentFailure,
      revenue: logMetric.revenue,
      cartAdditions: logMetric.cartAdditions,
      cartFailures: logMetric.cartFailures,
      cartRemovals: logMetric.cartRemovals,
      reviewsSubmitted: logMetric.reviewsSubmitted,
      reviewRatings: Object.entries(logMetric.reviewRatings)
        .map(([stars, count]) => `${stars} stars: ${count}`)
        .join(', '), // Convert object to string
      lowStockWarnings: logMetric.lowStockWarnings,
      stockUpdates: logMetric.stockUpdates,
    };
  });

  // Write headers if file is empty, otherwise just append the data
  try {
    await csvWriter.writeRecords(formattedRecords);
    console.log('Metrics have been written/appended to CSV.');
  } catch (err) {
    console.error('Error writing/appending to CSV:', err);
  }
}



/**
 * Function to dynamically parse a log line.
 * This uses regular expressions to dynamically extract timestamp, module, level, and message.
 * It can be adapted to handle changes in log format in the future.
 */
function parseLog(line: string): LogEntry | null {
  // Match and capture timestamp, module, log level, and message (in any order)
  const timestampRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
  const moduleRegex = /\[module: (\w+)\]/;
  const levelRegex = /\[(INFO|WARNING|ERROR)\]/;
  const messageRegex = /.+$/;  // Capture the rest of the message after log level and module

  // Extract all parts from the log
  const timestampMatch = line.match(timestampRegex);
  const moduleMatch = line.match(moduleRegex);
  const levelMatch = line.match(levelRegex);
  const messageMatch = line.match(messageRegex);

  if (timestampMatch && moduleMatch && messageMatch) {
    const timestamp = timestampMatch[0];
    const module = moduleMatch[1];
    const level = levelMatch ? levelMatch[1] : 'INFO'; // Default to INFO if no level detected
    const message = messageMatch[0];

    return { level, timestamp, module, message };
  }

  return null; // Return null if the log line doesn't match expected patterns
}

/**
 * Function to analyze a parsed log entry and update metrics accordingly.
 */
function analyzeLog(entry: LogEntry) {
  try {
    // console.log('analyzeLog :: entry :: ', entry);
    
    // Parse log content
    parseOrderLogs(entry);
    parseCartLogs(entry);
    parseReviewLogs(entry);
    parseSearchLogs(entry);
    parsePaymentLogs(entry);
    parseStockLogs(entry);

    // Track log levels
    trackLogLevels(entry);

    // writeMetricsToCSV()
    logMetrics.timestamp = entry.timestamp;
    
  } catch (error: any) {
    console.error('Error processing log entry:', entry, error.message);
    return null
  }
}

// Handle log levels (INFO, WARNING, ERROR)
function trackLogLevels(entry: LogEntry) {
  switch (entry.level) {
    case 'INFO':
      logMetrics.info++;
      break;
    case 'WARNING':
      logMetrics.warning++;
      break;
    case 'ERROR':
      logMetrics.error++;
      break;
    default:
      console.warn(`Unrecognized log level: ${entry.level}`);
  }
}

// Generalized handler for order-related logs
function parseOrderLogs(entry: LogEntry) {
  const orderRegex = /\bOrder\b.*#[0-9]+/;  // Capture order-related logs
  if (!orderRegex.test(entry.message)) return;

  if (/created for/.test(entry.message)) {
    logMetrics.ordersPlaced++;
  } else if (/canceled by/.test(entry.message)) {
    logMetrics.ordersCanceled++;
  } else if (/shipped to/.test(entry.message)) {
    logMetrics.ordersCompleted++;
  }
}


// Generalized handler for cart-related logs
function parseCartLogs(entry: LogEntry) {
  const productRegex = /\bproduct\b.*ID #[0-9]+/;
  if (!productRegex.test(entry.message)) return;

  if (/added product/.test(entry.message)) {
    logMetrics.cartAdditions++;
  } else if (/failed to add product/.test(entry.message)) {
    logMetrics.cartFailures++;
  }
}

// Handle product reviews
function parseReviewLogs(entry: LogEntry) {
  const reviewRegex = /submitted a review for product ID #[0-9]+: rating (\d+) stars/;
  const reviewMatch = entry.message.match(reviewRegex);

  if (reviewMatch) {
    logMetrics.reviewsSubmitted++;
    const rating = parseInt(reviewMatch[1]);
    logMetrics.reviewRatings[rating] = (logMetrics.reviewRatings[rating] || 0) + 1;
  }
}

// Generalized handler for search-related logs// Generalized handler for search-related logs
function parseSearchLogs(entry: LogEntry) {
  const searchRegex = /\bsearch\b.*query '([^']+)'/;
  const searchMatch = entry.message.match(searchRegex);

  if (searchMatch) {
    logMetrics.searchCount++;
    const searchTerm = searchMatch[1];

    // Increment the count for the search term
    logMetrics.searchTerms[searchTerm] = (logMetrics.searchTerms[searchTerm] || 0) + 1;

    // Get an array of search terms sorted by their count in descending order
    const sortedSearchTerms = Object.entries(logMetrics.searchTerms)
      .sort(([, countA], [, countB]) => countB - countA) // Sort by count (descending)
      .slice(0, 3); // Keep only the top 3 search terms

    // Rebuild the searchTerms object with only the top 3 search terms
    logMetrics.searchTerms = Object.fromEntries(sortedSearchTerms);
  }
}


// Generalized handler for payment-related logs
function parsePaymentLogs(entry: LogEntry) {
  const paymentSuccessRegex = /Payment.*success.*order.*ID #[0-9]+.*amount: \$([\d.]+)/;
  const paymentFailureRegex = /Payment.*failed.*order.*ID #[0-9]+.*amount: \$([\d.]+)/;

  const paymentSuccessMatch = entry.message.match(paymentSuccessRegex);
  if (paymentSuccessMatch) {
    logMetrics.paymentSuccess++;
    logMetrics.revenue = parseFloat((logMetrics.revenue + parseFloat(paymentSuccessMatch[1])).toFixed(2));
  }

  const paymentFailureMatch = entry.message.match(paymentFailureRegex);
  if (paymentFailureMatch) {
    logMetrics.paymentFailure++;
  }
}

// Handle stock warnings and updates
function parseStockLogs(entry: LogEntry) {
  if (entry.message.includes('Low stock warning for product ID')) {
    logMetrics.lowStockWarnings++;
  } else if (entry.message.includes('Stock updated for product ID')) {
    logMetrics.stockUpdates++;
  }
}

async function loadPreviousMetrics() {
  if (fs.existsSync(outputFile)) {
    // Open the file for reading
    const fileStream = fs.createReadStream(outputFile);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Recognize all instances of CR LF as a single newline
    });

    let lastLine: any;

    // Read the file line by line and store the last line
    for await (const line of rl) { 
      lastLine = line;
    }

    // Check if lastLine is available and parse it into metrics
    if (lastLine) {
      const parsed = lastLine.split(',');

      // Update the numeric metrics
      logMetrics.info = parseInt(parsed[1]) || 0;
      logMetrics.warning = parseInt(parsed[2]) || 0;
      logMetrics.error = parseInt(parsed[3]) || 0;
      logMetrics.searchCount = parseInt(parsed[4]) || 0;
      logMetrics.ordersPlaced = parseInt(parsed[6]) || 0;
      logMetrics.ordersCompleted = parseInt(parsed[7]) || 0;
      logMetrics.ordersCanceled = parseInt(parsed[8]) || 0;
      logMetrics.paymentSuccess = parseInt(parsed[9]) || 0;
      logMetrics.paymentFailure = parseInt(parsed[10]) || 0;
      logMetrics.revenue = parseFloat(parsed[11]) || 0;
      logMetrics.cartAdditions = parseInt(parsed[12]) || 0;
      logMetrics.cartFailures = parseInt(parsed[13]) || 0;
      logMetrics.cartRemovals = parseInt(parsed[14]) || 0;
      logMetrics.reviewsSubmitted = parseInt(parsed[15]) || 0;
      logMetrics.lowStockWarnings = parseInt(parsed[17]) || 0;
      logMetrics.stockUpdates = parseInt(parsed[18]) || 0;

      // Parse search terms (in format: "blender: 10, camera: 5")
      const searchTermStr = parsed[5].replace(/['"]/g, '');  // Remove quotes if present
      searchTermStr.split(',').forEach((term:any) => {
        const [termName, termCount] = term.split(':').map((item:any) => item.trim());
        if (termName && termCount) {
          logMetrics.searchTerms[termName] = parseInt(termCount) || 0;
        }
      });

      // Parse review ratings (in format: "2 stars: 1, 3 stars: 2")
      const reviewRatingStr = parsed[16].replace(/['"]/g, '');  // Remove quotes if present
      reviewRatingStr.split(',').forEach((rating:any) => {
        const [stars, count] = rating.split(':').map((item:any) => item.trim());
        const starValue = parseInt(stars.replace('stars', '').trim());
        if (starValue && count) {
          logMetrics.reviewRatings[starValue] = parseInt(count) || 0;
        }
      });
    }

    console.log('Previous metrics loaded from the last row of CSV.');
  } else {
    console.log('No previous metrics found, starting fresh.');
  }
}

function scheduleBatchWrite() {
  setInterval(() => {
    if (metricsBatchRecords.length > 0) {
      appendCsvRecord(metricsBatchRecords); // Write batch to CSV
      metricsBatchRecords = []; // Clear the batch
    }
  }, TIME_INTERVAL); // Adjust the time interval (in ms) as required
}

export async function ingestLogs() {
  await loadPreviousMetrics();

  const logEmitter = await watchLogFile(); // Start watching the log file

  // Listen for 'logEntry' events and process each log entry
  logEmitter.on('logInterval', (logEntries: string[]) => {
    logEntries.forEach((logEntry: string) => {
      const logEntryParsed = parseLog(logEntry);
      if (logEntryParsed) {
        analyzeLog(logEntryParsed);
        metricsBatchRecords.push({ ...logMetrics }); // Add current metrics to the batch
      }
    })
  });

  // Schedule batch write every `n` minutes
  scheduleBatchWrite();

  logEmitter.on('error', (err: any) => {
    console.error('Error from log watcher:', err);
  });
}

