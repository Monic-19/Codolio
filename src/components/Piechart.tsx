import React from 'react';
import ApexCharts from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface PieChartProps {
    data: {
      labels: string[];
      series: number[];
    };
  }

  const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const chartOptions: ApexOptions = {
      chart: {
        type: 'pie',
      },
      labels: data.labels,
      colors: ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#FF66C3'], 
      responsive: [
        {
          breakpoint: 420,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  
    const chartSeries = data.series; 
  
    return (
      <div>
        <ApexCharts
          options={chartOptions}
          series={chartSeries}
          type="pie"
          width="450"
        />
      </div>
    );
  };
  
  export default PieChart;