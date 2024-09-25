import { create } from 'zustand'


type Metric = {
  timestamp: string;
  infoCount: number;
  warningCount: number;
  errorCount: number;
  searchCount: number;
  topSearchTerms: Record<string, number>;  // Object where keys are search terms and values are counts
  ordersPlaced: number;
  ordersCompleted: number;
  ordersCanceled: number;
  paymentSuccess: number;
  paymentFailure: number;
  totalRevenue: number;
  cartAdditions: number;
  cartFailures: number;
  cartRemovals: number;
  reviewsSubmitted: number;
  reviewRatings: Record<number, number>; // Object where keys are star ratings and values are counts
  lowStockWarnings: number;
  stockUpdates: number;
}

export type AppStoreValuesType = {
  siteName: string
  metrics: Metric[]
}

export type AppStoreType = AppStoreValuesType & {
  setSiteName: (value: string) => void,
  setMetrics: (value: Metric[]) => void
}

const useAppStore = create<AppStoreType>((set) => ({
  siteName: 'Amuselabs',
  metrics: [],

  setSiteName: (value) =>
    set((state) => {
      return {
        ...state,
        siteName: value,
      }
    }),

  setMetrics: (value) =>
    set((state) => {
      return {
        ...state,
        metrics: value,
      }
    }),
}))

export default useAppStore
