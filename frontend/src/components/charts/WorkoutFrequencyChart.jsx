import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function WorkoutFrequencyChart({ data = [] }) {
  // data: [{date, count, minutes}]
  if (!data.length) return (
    <div className="h-40 flex items-center justify-center text-gray-600 text-sm">
      No workout data yet
    </div>
  );

  const labels   = data.map((d) => {
    const date = new Date(d.date + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label:           'Minutes',
        data:            data.map((d) => d.minutes),
        backgroundColor: 'rgba(34,197,94,0.3)',
        borderColor:     'rgba(34,197,94,0.8)',
        borderWidth:     1.5,
        borderRadius:    6,
        borderSkipped:   false,
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
        callbacks: {
          label: (ctx) => ` ${ctx.raw} minutes`,
        },
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
      <Bar data={chartData} options={options} />
    </div>
  );
}