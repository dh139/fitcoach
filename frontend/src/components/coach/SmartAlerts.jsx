import { AlertTriangle, TrendingUp, Info, Zap, X } from 'lucide-react';
import { useState } from 'react';

const ALERT_CONFIG = {
  urgent:   { icon: AlertTriangle, bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-300',    action: 'text-red-400'    },
  warning:  { icon: AlertTriangle, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-300', action: 'text-yellow-400' },
  positive: { icon: TrendingUp,    bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-300',  action: 'text-green-400'  },
  info:     { icon: Info,          bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-300',   action: 'text-blue-400'   },
};

export default function SmartAlerts({ alerts = [], onActionClick }) {
  const [dismissed, setDismissed] = useState(new Set());

  const visible = alerts.filter((_, i) => !dismissed.has(i));
  if (!visible.length) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        if (dismissed.has(i)) return null;
        const cfg  = ALERT_CONFIG[alert.type] || ALERT_CONFIG.info;
        const Icon = cfg.icon;

        return (
          <div key={i} className={`flex items-start gap-3 ${cfg.bg} border ${cfg.border} rounded-2xl p-3.5`}>
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.text}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${cfg.text} leading-snug`}>{alert.message}</p>
              {alert.action && (
                <button
                  onClick={() => onActionClick?.(alert.action)}
                  className={`text-xs ${cfg.action} mt-1 hover:underline text-left`}
                >
                  {alert.action} →
                </button>
              )}
            </div>
            <button
              onClick={() => setDismissed((prev) => new Set([...prev, i]))}
              className="text-gray-600 hover:text-gray-400 flex-shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}