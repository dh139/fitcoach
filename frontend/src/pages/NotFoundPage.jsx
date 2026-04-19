import { useNavigate } from 'react-router-dom';
import { Dumbbell, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/20 flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-10 h-10 text-brand-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-gray-400 text-sm mb-6">
          This page skipped leg day — it doesn't exist.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2 mx-auto"
        >
          <Home className="w-4 h-4" /> Back home
        </button>
      </div>
    </div>
  );
}