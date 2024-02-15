import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment"

interface LineChartProps {
    chartData: any;
  }

function LineChart({ chartData }: LineChartProps) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Line Chart</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020"
            },
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              type: 'timeseries',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM'
                },
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 6,
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }}
      />
    </div>
  );
}
export default LineChart;