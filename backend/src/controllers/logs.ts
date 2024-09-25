import { Request, Response, NextFunction } from 'express'
import { ingestLogs } from '../services/analyze-logs';
import { getCsvData } from '../services/log-metrics';

// export const getExecuteLogMetrics = (
//   req: Request,
//   res: Response,
//   next: NextFunction) => {
//   try {

//     const _res:any = ingestLogs();
//     if(!_res || _res.error) {
//       return res.status(500).json({ error: _res?.error || 'Something went wrong' })
//     }

//     return res
//       .status(200)
//       .json({ message: 'Success', data: {  } }) 

//   } catch (error: any) {
//     console.log('getLogMetrics :: error :: ', error?.message);
//     return res
//       .status(500)
//       .json({ error: error?.message || 'Internal server error' })
//   }
// }

export const getLogMetrics = async(
  req: Request,
  res: Response,
  next: NextFunction) => {
  try {
    console.log('getLogMetrics :: ');
    const _res:any = await getCsvData()
    console.log('getLogMetrics :: _res :: ', _res);
    if(!_res || _res.error) {
      return res.status(500).json({ error: _res?.error || 'Something went wrong' })
    } 

    return res
      .status(200)
      .json({ message: 'Success', data: _res })
    
    
  } catch (error: any) {
    console.log('getLogMetrics :: error :: ', error?.message);
    return res
      .status(500)
      .json({ error: error?.message || 'Internal server error' })
  }
}