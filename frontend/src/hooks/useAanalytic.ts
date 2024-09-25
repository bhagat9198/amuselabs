import { getAanalyticsApi } from '@/apis/home'
import useAppStore from '@/store/app';
import React, { useEffect } from 'react'

export default function useAanalyticHook() {
  const appStore = useAppStore();

  // Helper function to parse the API response
  function parseMetricsData(data: any) {
    return data.map((item: any) => ({
      timestamp: item.TIMESTAMP,
      infoCount: Number(item.INFO_COUNT),
      warningCount: Number(item.WARNING_COUNT),
      errorCount: Number(item.ERROR_COUNT),
      searchCount: Number(item.SEARCH_COUNT),
      topSearchTerms: parseTerms(item.TOP_SEARCH_TERMS),
      ordersPlaced: Number(item.ORDERS_PLACED),
      ordersCompleted: Number(item.ORDERS_COMPLETED),
      ordersCanceled: Number(item.ORDERS_CANCELED),
      paymentSuccess: Number(item.PAYMENT_SUCCESS),
      paymentFailure: Number(item.PAYMENT_FAILURE),
      totalRevenue: Number(item.TOTAL_REVENUE),
      cartAdditions: Number(item.CART_ADDITIONS),
      cartFailures: Number(item.CART_FAILURES),
      cartRemovals: Number(item.CART_REMOVALS),
      reviewsSubmitted: Number(item.REVIEWS_SUBMITTED),
      reviewRatings: parseRatings(item.REVIEW_RATINGS),
      lowStockWarnings: Number(item.LOW_STOCK_WARNINGS),
      stockUpdates: Number(item.STOCK_UPDATES),
    }));
  }

  // Function to parse "TOP_SEARCH_TERMS" like "vacuum cleaner: 1, SSD: 1"
  function parseTerms(terms: string) {
    const termPairs = terms.split(',').map((term: string) => term.trim());
    const termObj: Record<string, number> = {};
    termPairs.forEach((pair: string) => {
      const [term, count] = pair.split(':').map((str) => str.trim());
      termObj[term] = Number(count);
    });
    return termObj;
  }

  // Function to parse "REVIEW_RATINGS" like "1 stars: 1, 4 stars: 1"
  function parseRatings(ratings: string) {
    const ratingPairs = ratings.split(',').map((rating: string) => rating.trim());
    const ratingObj: Record<number, number> = {};
    ratingPairs.forEach((pair: string) => {
      const [stars, count] = pair.split(':').map((str) => str.trim());
      const starValue = Number(stars.split(' ')[0]); // Extract star value from "1 stars"
      ratingObj[starValue] = Number(count);
    });
    return ratingObj;
  }


  useEffect(() => {
      async function fetchData() {
        const _res = await getAanalyticsApi({})
        console.log('useAanalytic :: fetchData :: _res :: ', _res);
        
        const _metrics = parseMetricsData(_res?.data || [])
        appStore.setMetrics(_metrics)
        return
      }

      fetchData()
  }, [])

  return;
}
