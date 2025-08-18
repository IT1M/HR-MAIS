
import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  data: {
    labels: string[];
    data: number[];
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
    {
      label: 'مستوى المهارة',
      data: data.data,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      fill: true
    }]

  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        rtl: true,
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.r}%`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          color: 'rgba(107, 114, 128, 0.7)',
          font: {
            family: 'Arial, sans-serif'
          },
          callback: function (value: any) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        angleLines: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        pointLabels: {
          color: 'rgba(17, 24, 39, 0.8)',
          font: {
            size: 12,
            family: 'Arial, sans-serif',
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Radar data={chartData} options={options} />
    </div>);

};

export default RadarChart;