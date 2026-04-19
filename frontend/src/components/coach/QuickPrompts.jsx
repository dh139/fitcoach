const QUICK_PROMPTS = [
  { label: 'Generate workout plan',      prompt: 'Create a personalised workout plan for me based on my fitness goal and current level.' },
  { label: 'Diet suggestions',           prompt: 'Give me Indian-friendly meal suggestions for my fitness goal with calorie counts.' },
  { label: 'Explain my score',           prompt: 'Explain my improvement score and tell me exactly what I need to do to increase it.' },
  { label: 'Plateau advice',             prompt: 'I feel like I am stuck and not progressing. What should I change in my routine?' },
  { label: 'Motivation boost',           prompt: 'I need motivation. Remind me why I started and give me a push to work out today.' },
  { label: 'Recovery tips',             prompt: 'What are the best recovery strategies between workouts for my level?' },
  { label: 'Protein sources in India',  prompt: 'What are the best high-protein Indian foods I should be eating for muscle building?' },
  { label: 'Next workout suggestion',   prompt: 'Based on my recent sessions, what should my next workout focus on?' },
];

export default function QuickPrompts({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_PROMPTS.map(({ label, prompt }) => (
        <button
          key={label}
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="text-xs bg-dark-700 hover:bg-dark-600 border border-white/10 hover:border-brand-500/40 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {label}
        </button>
      ))}
    </div>
  );
}