import { Router } from 'express';
import * as logController from './../controllers/logs';

const router = Router();

// Route to get log metrics
router.get('/analyse', logController.getLogMetrics);

export default router;
