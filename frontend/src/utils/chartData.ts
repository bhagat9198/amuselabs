import { tailwindConfig } from '@/utils/Utils';
import moment from 'moment';

export function getChartDataFromCounts(metrics) {
  // Extract labels (formatted timestamps using moment)
  const labels = metrics.map((metric) => moment(metric.timestamp).format('MM-DD-YYYY HH:mm'));

  // Extract dataset values for infoCount, warningCount, and errorCount
  const infoCountData = metrics.map((metric) => metric.infoCount);
  const warningCountData = metrics.map((metric) => metric.warningCount);
  const errorCountData = metrics.map((metric) => metric.errorCount);

  // Create the datasets
  const chartData = {
    labels: labels,
    datasets: [
      // Dataset for infoCount
      {
        label: 'Info Count',
        data: infoCountData,
        borderColor: tailwindConfig().theme.colors.violet[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.violet[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Dataset for warningCount
      {
        label: 'Warning Count',
        data: warningCountData,
        borderColor: tailwindConfig().theme.colors.sky[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.sky[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.sky[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Dataset for errorCount
      {
        label: 'Error Count',
        data: errorCountData,
        borderColor: tailwindConfig().theme.colors.green[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.green[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.green[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return chartData;
}

export function getChartDataFromOrders(metrics) {
  // Extract labels (formatted timestamps using moment)
  const labels = metrics.map((metric) => moment(metric.timestamp).format('MM-DD-YYYY HH:mm'));

  // Extract dataset values for ordersPlaced, ordersCompleted, and ordersCanceled
  const ordersPlacedData = metrics.map((metric) => metric.ordersPlaced);
  const ordersCompletedData = metrics.map((metric) => metric.ordersCompleted);
  const ordersCanceledData = metrics.map((metric) => metric.ordersCanceled);

  // Create the datasets
  const chartData = {
    labels: labels,
    datasets: [
      // Dataset for ordersPlaced
      {
        label: 'Orders Placed',
        data: ordersPlacedData,
        borderColor: tailwindConfig().theme.colors.violet[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.violet[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Dataset for ordersCompleted
      {
        label: 'Orders Completed',
        data: ordersCompletedData,
        borderColor: tailwindConfig().theme.colors.sky[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.sky[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.sky[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Dataset for ordersCanceled
      {
        label: 'Orders Canceled',
        data: ordersCanceledData,
        borderColor: tailwindConfig().theme.colors.green[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.green[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.green[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return chartData;
}

export function getChartDataFromCart(metrics) {
  // Extract labels (formatted timestamps using moment)
  const labels = metrics.map((metric) => moment(metric.timestamp).format('MM-DD-YYYY HH:mm'));

  // Extract dataset values for cartAdditions, cartFailures, and cartRemovals
  const cartAdditionsData = metrics.map((metric) => metric.cartAdditions);
  const cartFailuresData = metrics.map((metric) => metric.cartFailures);
  const cartRemovalsData = metrics.map((metric) => metric.cartRemovals);

  // Create the datasets
  const chartData = {
    labels: labels,
    datasets: [
      // Dataset for cartAdditions
      {
        label: 'Cart Additions',
        data: cartAdditionsData,
        borderColor: tailwindConfig().theme.colors.violet[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.violet[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.violet[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Dataset for cartFailures
      {
        label: 'Cart Failures',
        data: cartFailuresData,
        borderColor: tailwindConfig().theme.colors.sky[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.sky[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.sky[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Dataset for cartRemovals
      {
        label: 'Cart Removals',
        data: cartRemovalsData,
        borderColor: tailwindConfig().theme.colors.green[500],
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.green[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.green[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return chartData;
}

export function getChartDataFromTopSearchTerms(metrics) {
  // Initialize array to collect all search terms with their counts
  const searchTermsArray = [];

  // Loop through the metrics to extract topSearchTerms (assuming metrics is an array of objects)
  metrics.forEach((metric, index) => {
    // For each search term in the current metric
    Object.entries(metric.topSearchTerms).forEach(([term, count]: [term: any, count: number]) => {
      if (term && count > 0) {
        // Collect each search term and its count
        searchTermsArray.push({ term, count, index });
      }
    });
  });

  // Sort search terms by their count in descending order and take the top 3
  const topSearchTerms = searchTermsArray
    .sort((a, b) => b.count - a.count) // Sort by count (highest first)
    .slice(0, 3); // Take the top 3

  // Initialize arrays for labels, data, and colors
  const labels = topSearchTerms.map(item => item.term); // Extract terms as labels
  const data = topSearchTerms.map(item => item.count);  // Extract counts as data
  const backgroundColors = topSearchTerms.map((item, index) => getBgColor(index)); // Set background colors
  const hoverBackgroundColors = topSearchTerms.map((item, index) => getHoverColor(index)); // Set hover colors

  // Return chartData in the required format
  return {
    labels: labels, // e.g., ['blender', 'vacuum cleaner', 'SSD']
    datasets: [
      {
        label: 'Top Search Terms', // Label for the dataset
        data: data, // e.g., [10, 5, 7]
        backgroundColor: backgroundColors, // Colors for each term
        hoverBackgroundColor: hoverBackgroundColors, // Hover colors for each term
        borderWidth: 0, // Border width for each section
      },
    ],
  };
}

export function getChartDataFromStocks(metrics) {
  // Initialize arrays for labels and data
  const labels = [];
  const lowStockWarningsData = [];
  const stockUpdatesData = [];

  // Loop through the metrics and extract the required payment data
  metrics.forEach(metric => {
    // Convert timestamp to a label format with date and time (MM-DD-YYYY HH:mm)
    const label = new Date(metric.timestamp).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    });

    // Add the timestamp to labels array
    labels.push(label);

    lowStockWarningsData.push(metric.lowStockWarnings);
    stockUpdatesData.push(metric.stockUpdates);
  });

  // Return chartData in the required format
  return {
    labels: labels, // Example: ['12-01-2022 14:00', '01-01-2023 09:30']
    datasets: [
      // Light blue bars
      {
        label: 'Low Stock Warning',
        data: lowStockWarningsData, // Example: [800, 1600, 900, 1300, 1950, 1700]
        backgroundColor: tailwindConfig().theme.colors.sky[500], // Light blue
        hoverBackgroundColor: tailwindConfig().theme.colors.sky[600],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Violet bars
      {
        label: 'Stock Update',
        data: stockUpdatesData, // Example: [4900, 2600, 5350, 4800, 5200, 4800]
        backgroundColor: tailwindConfig().theme.colors.violet[500], // Violet
        hoverBackgroundColor: tailwindConfig().theme.colors.violet[600],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };
}

export function getChartDataFromPayments(metrics) {
  // Initialize arrays for labels and data
  const labels = [];
  const paymentSuccessData = [];
  const paymentFailureData = [];

  // Loop through the metrics and extract the required payment data
  metrics.forEach(metric => {
    // Convert timestamp to a label format with date (MM-DD-YYYY)
    const label = new Date(metric.timestamp).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    });

    // Add the timestamp to labels array
    labels.push(label);

    // Add payment success and failure data
    paymentSuccessData.push(metric.paymentSuccess);
    paymentFailureData.push(-metric.paymentFailure); // Negative for stacked bars
  });

  // Return chartData in the required format
  return {
    labels: labels, // Example: ['12-01-2022', '01-01-2023']
    datasets: [
      // Light blue bars for paymentSuccess
      {
        label: 'Payment Success (Stack 1)',
        data: paymentSuccessData, // Example: [6200, 9200]
        backgroundColor: tailwindConfig().theme.colors.violet[500], // Light blue
        hoverBackgroundColor: tailwindConfig().theme.colors.violet[600],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      // Violet bars for paymentFailure (negative values for stacking)
      {
        label: 'Payment Failure (Stack 2)',
        data: paymentFailureData, // Example: [-4000, -2600]
        backgroundColor: tailwindConfig().theme.colors.violet[200], // Light violet
        hoverBackgroundColor: tailwindConfig().theme.colors.violet[300],
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };
}


// Helper function to generate background colors for the chart
function getBgColor(index) {
  const colors = [
    tailwindConfig().theme.colors.violet[500],
    tailwindConfig().theme.colors.yellow[500],
    tailwindConfig().theme.colors.green[800],
  ];
  return colors[index]; // Cycle through colors if more than available
}

function getHoverColor(index) {
  const colors = [
    tailwindConfig().theme.colors.violet[600],
    tailwindConfig().theme.colors.yellow[600],
    tailwindConfig().theme.colors.green[900],
  ];
  return colors[index]; // Cycle through hover colors if more than available
}



