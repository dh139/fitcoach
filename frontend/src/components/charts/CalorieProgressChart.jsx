import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function CalorieProgressChart({ data = [], goal = 2000 }) {
  if (!data.length) return (
    <div className="h-40 flex items-center justify-center text-gray-600 text-sm">
      Log meals to see calorie trend
    </div>
  );

  const labels = data.map((d) =>
    new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
  );

  const chartData = {
    labels,
    datasets: [
      {
        label:           'Calories',
        data:            data.map((d) => d.calories),
        borderColor:     'rgba(249,115,22,0.9)',
        backgroundColor: 'rgba(249,115,22,0.08)',
        fill:            true,
        tension:         0.4,
        pointRadius:     4,
        pointBackgroundColor: 'rgba(249,115,22,0.9)',
        pointBorderColor:     'rgba(17,17,17,1)',
        pointBorderWidth:     2,
      },
      {
        label:       'Goal',
        data:        data.map(() => goal),
        borderColor: 'rgba(255,255,255,0.12)',
        borderDash:  [4, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill:        false,
        tension:     0,
      },
    ],
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17,17,17,0.95)',
        borderColor:     'rgba(255,255,255,0.1)',
        borderWidth:     1,
        titleColor:      '#fff',
        bodyColor:       '#9ca3af',
      },
    },
    scales: {
      x: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#6b7280', font: { size: 11 } },
      },
      y: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#6b7280', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: 180 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}