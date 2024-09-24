import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { createObjectCsvWriter } from 'csv-writer';

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
const csvWriter = createObjectCsvWriter({
  path: outputFile,
  header: csvFileHeaders,
});

// Track the last file size to only read new log lines
let lastFileSize = 0;

/**
 * Function to parse a single log line.
 * This uses regular expressions to extract relevant fields from a log entry.
 * If the log entry doesn't match the expected format, it returns null.
 */
function parseLog(line: string): LogEntry | null {
  const logRegex = /^\[(\w+)] \[([\d\-:\s]+)] \[module: (\w+)] (.+)$/;
  const match = line.match(logRegex);

  if (match) {
    const [_, level, timestamp, module, message] = match;
    return { level, timestamp, module, message };
  }
  return null;
}

/**
 * Function to analyze a parsed log entry and update metrics accordingly.
 */
function analyzeLog(entry: LogEntry) {
  try {
    // Parse log content
    parseOrderLogs(entry);
    parseCartLogs(entry);
    parseReviewLogs(entry);
    parseSearchLogs(entry);
    parsePaymentLogs(entry);
    parseStockLogs(entry);

    // Track log levels
    trackLogLevels(entry);
  } catch (error: any) {
    console.error('Error processing log entry:', entry, error.message);
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

// Handle order-related activities
function parseOrderLogs(entry: LogEntry) {
  const orderRegex = /Order #[0-9]+/;
  if (!orderRegex.test(entry.message)) return;

  if (entry.message.includes('created for')) {
    logMetrics.ordersPlaced++;
  } else if (entry.message.includes('canceled by')) {
    logMetrics.ordersCanceled++;
  } else if (entry.message.includes('shipped to')) {
    logMetrics.ordersCompleted++;
  }
}

// Handle cart-related activities
function parseCartLogs(entry: LogEntry) {
  const productRegex = /product ID #[0-9]+/;
  if (!productRegex.test(entry.message)) return;

  if (entry.message.includes('added product ID')) {
    logMetrics.cartAdditions++;
  } else if (entry.message.includes('failed to add product ID')) {
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

// Handle product searches
function parseSearchLogs(entry: LogEntry) {
  const searchRegex = /Product search for query '([^']+)'/;
  const searchMatch = entry.message.match(searchRegex);

  if (searchMatch) {
    logMetrics.searchCount++;
    const searchTerm = searchMatch[1];
    logMetrics.searchTerms[searchTerm] = (logMetrics.searchTerms[searchTerm] || 0) + 1;
  }
}

// Handle payment activities
function parsePaymentLogs(entry: LogEntry) {
  const paymentSuccessRegex = /Payment processed successfully for order ID #[0-9]+ amount: \$([\d.]+)/;
  const paymentFailureRegex = /Payment failed for order ID #[0-9]+ amount: \$([\d.]+)/;

  const paymentSuccessMatch = entry.message.match(paymentSuccessRegex);
  if (paymentSuccessMatch) {
    logMetrics.paymentSuccess++;
    logMetrics.revenue += parseFloat(paymentSuccessMatch[1]);
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

/**
 * Function to write the collected metrics to a CSV file.
 */
function writeMetricsToCSV() {
  const currentTime = new Date().toISOString();

  // Get top 3 search terms along with their counts
  const topSearchTerms = Object.entries(logMetrics.searchTerms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([term, count]) => `${term}: ${count}`) // Include both the term and the count
    .join(', ');

  // Aggregate review ratings
  const reviewRatingsSummary = Object.entries(logMetrics.reviewRatings)
    .map(([rating, count]) => `${rating} stars: ${count}`)
    .join(', ');

  // Write metrics to CSV
  csvWriter.writeRecords([{
    timestamp: currentTime,
    info: logMetrics.info,
    warning: logMetrics.warning,
    error: logMetrics.error,
    searchCount: logMetrics.searchCount,
    topSearchTerms: topSearchTerms || 'N/A',  // Display both term and count
    ordersPlaced: logMetrics.ordersPlaced,
    ordersCompleted: logMetrics.ordersCompleted,
    ordersCanceled: logMetrics.ordersCanceled,
    paymentSuccess: logMetrics.paymentSuccess,
    paymentFailure: logMetrics.paymentFailure,
    revenue: logMetrics.revenue,
    cartAdditions: logMetrics.cartAdditions,
    cartFailures: logMetrics.cartFailures,
    cartRemovals: logMetrics.cartRemovals,
    reviewsSubmitted: logMetrics.reviewsSubmitted,
    reviewRatings: reviewRatingsSummary || 'N/A',
    lowStockWarnings: logMetrics.lowStockWarnings,
    stockUpdates: logMetrics.stockUpdates,
  }]).then(() => {
    console.log('Metrics have been written to CSV.');
  });
}

/**
 * Function to ingest logs from the specified file path starting from a given position.
 */
function readNewLogEntries(fromPosition: number) {
  const readStream = fs.createReadStream(logFilePath, { encoding: 'utf8', start: fromPosition });
  const rl = readline.createInterface({ input: readStream, crlfDelay: Infinity });

  rl.on('line', (line: string) => {
    const logEntry = parseLog(line);
    if (logEntry) {
      analyzeLog(logEntry);
    }
  });

  rl.on('close', () => {
    writeMetricsToCSV(); // Write metrics after processing the new batch of logs
  });

  rl.on('error', (err) => {
    console.error('Error reading new log entries:', err);
  });
}

/**
 * Function to monitor the log file for changes and process new lines as they are added.
 */
export function ingestLogs() {
  fs.watch(logFilePath, (eventType) => {
    if (eventType === 'change') {
      // Check the file size and process new lines if the file has grown
      fs.stat(logFilePath, (err, stats) => {
        if (err) {
          console.error('Error reading log file stats:', err);
          return;
        }

        if (stats.size > lastFileSize) {
          // New data has been added, so process only the new lines
          readNewLogEntries(lastFileSize);
          lastFileSize = stats.size;
        }
      });
    }
  });

  // Initialize the lastFileSize to the current size of the log file
  fs.stat(logFilePath, (err, stats) => {
    if (err) {
      console.error('Error initializing log file watcher:', err);
    } else {
      lastFileSize = stats.size;
    }
  });
}

// Start watching the log file
// watchLogFile();
