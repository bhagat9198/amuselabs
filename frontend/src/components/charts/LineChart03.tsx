import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { chartColors } from './ChartjsConfig';
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';
import { formatThousands } from '../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function LineChart03({ data, width, height }) {
  const canvas = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  const chartOptions = useMemo(() => ({
    layout: {
      padding: 20,
    },
    animation: false,
    scales: {
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        ticks: {
          callback: (value) => formatThousands(value),
          color: darkMode ? textColor.dark : textColor.light,
        },
        grid: {
          color: darkMode ? gridColor.dark : gridColor.light,
        },
      },
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd HH:mm:ss',
          unit: 'hour',
          displayFormats: {
            hour: 'MMM dd HH:mm',
          },
        },
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          autoSkipPadding: 48,
          maxRotation: 0,
          color: darkMode ? textColor.dark : textColor.light,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: () => false, // Disable tooltip title
          label: (context) => formatThousands(context.parsed.y),
        },
        bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
        backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
        borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
    maintainAspectRatio: false,
    resizeDelay: 200,
  }), [darkMode, textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor]);

  useEffect(() => {
    if (!canvas.current) return;

    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: chartOptions,
    });
    return () => newChart.destroy();
  }, [data, chartOptions]);

  useEffect(() => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext('2d');
    if (!ctx) return;

    let chartInstance = Chart.getChart(ctx);
    if (!chartInstance) return;

    if (darkMode) {
      chartInstance.options.scales.x.ticks.color = textColor.dark;
      chartInstance.options.scales.y.ticks.color = textColor.dark;
      chartInstance.options.scales.y.grid.color = gridColor.dark;
      chartInstance.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chartInstance.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chartInstance.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chartInstance.options.scales.x.ticks.color = textColor.light;
      chartInstance.options.scales.y.ticks.color = textColor.light;
      chartInstance.options.scales.y.grid.color = gridColor.light;
      chartInstance.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chartInstance.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chartInstance.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chartInstance.update('none');
  }, [darkMode, textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor]);

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default LineChart03;
