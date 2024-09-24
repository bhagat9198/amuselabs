import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser'; // Use default import for csv-parser
import moment from 'moment';

const outputFile = path.resolve(__dirname, '../data/output/metrics.csv');

// Function to get CSV data between start and end times
export function getCsvData(startTime?: string, endTime?: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    const defaultEndTime = moment(); // Current time
    const defaultStartTime = defaultEndTime.clone().subtract(24, 'hours'); // 24 hours before

    const start = startTime ? moment(startTime) : defaultStartTime;
    const end = endTime ? moment(endTime) : defaultEndTime;

    // Read the CSV file
    fs.createReadStream(outputFile)
      .pipe(csv()) // Correct default import usage
      .on('data', (row) => {
        const rowTimestamp = moment(row.TIMESTAMP);
        if (rowTimestamp.isBetween(start, end, undefined, '[]')) {
          data.push(row);
        }
      })
      .on('end', () => {
        if (data.length > 15) {
          const interval = Math.floor(data.length / 15);
          const reducedData = data.filter((_, index) => index % interval === 0).slice(0, 15);
          resolve(reducedData);
        } else {
          resolve(data);
        }
      })
      .on('error', (err: any) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      });
  });
}
