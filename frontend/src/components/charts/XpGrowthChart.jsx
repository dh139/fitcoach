import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function XpGrowthChart({ logs = [] }) {
  if (!logs.length) return (
    <div className="h-40 flex items-center justify-center text-gray-600 text-sm">
      No XP data yet
    </div>
  );

  // Build running balance from XP logs
  const points = logs
    .slice()
    .reverse()
    .slice(-14) // last 14 events
    .map((l) => ({
      label:   new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      balance: l.balanceAfter,
    }));

  const chartData = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        label:           'XP',
        data:            points.map((p) => p.balance),
        borderColor:     'rgba(168,85,247,0.9)',
        backgroundColor: 'rgba(168,85,247,0.08)',
        fill:            true,
        tension:         0.4,
        pointRadius:     3,
        pointBackgroundColor: 'rgba(168,85,247,0.9)',
        pointBorderColor:     'rgba(17,17,17,1)',
        pointBorderWidth:     2,
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
          label: (ctx) => ` ${ctx.raw.toLocaleString()} XP`,
        },
      },
    },
    scales: {
      x: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#6b7280', font: { size: 10 }, maxTicksLimit: 7 },
      },
      y: {
        grid:  { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#6b7280',
          font: { size: 10 },
          callback: (v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v,
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ height: 180 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}