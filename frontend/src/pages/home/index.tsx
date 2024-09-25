import BodyLayout from '@/components/bodyLayout';
import LineChart02 from '@/components/charts/LineChart02';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tailwindConfig } from '@/utils/Utils';
import BarChart01 from '@/components/charts/BarChart01';
import DoughnutChart from '@/components/charts/DoughnutChart';
import BarChart02 from '@/components/charts/BarChart02';
import useAppStore from '@/store/app';
import { getChartDataFromCart, getChartDataFromCounts, getChartDataFromOrders, getChartDataFromPayments, getChartDataFromReviewRatings, getChartDataFromStocks, getChartDataFromTopSearchTerms } from '@/utils/chartData';


export default function HomePage() {
  const appStore = useAppStore()
  console.log('HomePage :: appStore.metrics :: ', appStore.metrics);
  

  const countInfochartData = getChartDataFromCounts(appStore.metrics)
  // console.log('HomePage :: countInfochartData :: ', countInfochartData);

  const ordersInfochartData = getChartDataFromOrders(appStore.metrics)
  // console.log('HomePage :: ordersInfochartData :: ', ordersInfochartData);

  const cartInfochartData = getChartDataFromCart(appStore.metrics)
  // console.log('HomePage :: cartInfochartData :: ', cartInfochartData);

  const stocksCountChartData  = getChartDataFromStocks(appStore.metrics)
  console.log('HomePage :: stocksCountChartData :: ', stocksCountChartData);


  const topSearchesChartData = getChartDataFromTopSearchTerms(appStore.metrics)
  // console.log('HomePage :: topSearchesChartData :: ', topSearchesChartData);

  const reviewRatingsChartData = getChartDataFromReviewRatings(appStore.metrics)
  // console.log('HomePage :: reviewRatingsChartData :: ', reviewRatingsChartData);
  

  const paymentChartData = getChartDataFromPayments(appStore.metrics)
  // console.log('HomePage :: paymentChartData :: ', paymentChartData);


  return (
    <BodyLayout>
      <main className="grow">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
  
            <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Core Count Info</h2>
              </header>
              <LineChart02 data={countInfochartData} width={595} height={248} />
            </div>

            <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Stocks Updates Vs Warnings</h2>
              </header>
              <BarChart01 data={stocksCountChartData} width={595} height={248} />
            </div>

            <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Total Revenue</h2>
              </header>
              {/* Card content */}
              <div className="flex flex-col h-full">
                {/* Live visitors number */}
                <div className="px-5 py-3">
                  <div className="flex items-center">
                    {/* Red dot */}
                    <div className="relative flex items-center justify-center w-3 h-3 mr-3" aria-hidden="true">
                      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></div>
                      <div className="relative inline-flex rounded-full w-1.5 h-1.5 bg-red-500"></div>
                    </div>
                    {/* Vistors number */}
                    <div>
                      <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{appStore?.metrics?.length > 0 ? `₹ ${appStore?.metrics?.[appStore?.metrics.length - 1]?.totalRevenue}` : 'NA'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Searches</h2>
              </header>
              <DoughnutChart data={topSearchesChartData} width={389} height={260} />
            </div>

            <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Review Ratings</h2>
              </header>
              <DoughnutChart data={reviewRatingsChartData} width={389} height={260} />
            </div>


            <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Payment Success Vs Failed</h2>
              </header>
              <div className="grow">
                <BarChart02 data={paymentChartData} width={895} height={248} />
              </div>
            </div>

            <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Cart Info</h2>
              </header>
              <LineChart02 data={cartInfochartData} width={595} height={248} />
            </div>

            <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">Orders Info</h2>
              </header>
              <LineChart02 data={ordersInfochartData} width={595} height={248} />
            </div>



          </div>
        </div>
      </main>
    </BodyLayout>
  );
}

