import express, { Request, Response } from 'express';
import cors from 'cors'
import { watchLogFile } from './services/watch-logfile';

import logRoutes from './routes/logs'
import { ingestLogs } from './services/analyze-logs';
const app = express();
const port = 5300;

const allowedOrigins:string[] = []

allowedOrigins.push('http://localhost:5174')

const corsOptions = {
  credentials: true,
  origin: (origin:any, callback:any) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else { 
      callback(new Error('Origin not allowed by CORS'))
    }
  }, 
}

app.use(cors(corsOptions))
app.use('/logs', logRoutes)
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the backend !!!.....!!!!');
})

app.use('*', (req: Request, res: Response) => {
  res.status(404).send('404 - Route Not Found');
});

function onServerStart() {
  ingestLogs()
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
  onServerStart()
});
