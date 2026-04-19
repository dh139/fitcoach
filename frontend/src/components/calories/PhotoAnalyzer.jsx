import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { analyzePhoto, logFood } from '../../api/calories';

export default function PhotoAnalyzer({ onAdd, defaultMeal = 'snack' }) {
  const [preview,   setPreview]   = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState('');
  const [adding,    setAdding]    = useState({});
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setError('');
    setResult(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Convert to base64 for API
    const b64Reader = new FileReader();
    b64Reader.onload = async (e) => {
      const dataUrl   = e.target.result;
      const base64    = dataUrl.split(',')[1];
      const mimeType  = file.type;

      setAnalyzing(true);
      try {
        const data = await analyzePhoto({ base64Image: base64, mimeType });
        if (data.data?.success) {
          setResult(data.data);
        } else {
          setError(data.data?.message || 'Analysis failed — try manual entry');
        }
      } catch {
        setError('Photo analysis unavailable — add GROQ_API_KEY to backend .env');
      } finally {
        setAnalyzing(false);
      }
    };
    b64Reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAddItem = async (item, idx) => {
    setAdding((prev) => ({ ...prev, [idx]: true }));
    try {
      await onAdd({
        name:     item.name,
        quantity: 1,
        unit:     item.estimatedQuantity || 'serving',
        calories: item.calories,
        protein:  item.protein  || 0,
        carbs:    item.carbs    || 0,
        fat:      item.fat      || 0,
        fiber:    item.fiber    || 0,
        mealType: defaultMeal,
        source:   'photo',
        aiAnalysis: result?.notes || '',
      });
    } finally {
      setAdding((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const handleAddAll = async () => {
    if (!result?.items) return;
    for (let i = 0; i < result.items.length; i++) {
      await handleAddItem(result.items[i], i);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      {!preview && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-brand-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
        >
          <div className="w-12 h-12 rounded-2xl bg-dark-700 group-hover:bg-brand-500/10 flex items-center justify-center mx-auto mb-3 transition-colors">
            <Camera className="w-6 h-6 text-gray-500 group-hover:text-brand-500 transition-colors" />
          </div>
          <p className="text-sm font-medium text-gray-300 mb-1">Drop a food photo here</p>
          <p className="text-xs text-gray-600">or click to upload — AI will identify the food and estimate nutrition</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Preview + analysis */}
      {preview && (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={preview}
              alt="Food preview"
              className="w-full h-48 object-cover rounded-2xl"
            />
            <button
              onClick={() => { setPreview(null); setResult(null); setError(''); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
            {analyzing && (
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-sm text-white">AI analyzing food...</p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Results */}
          {result?.items?.length > 0 && (
            <div className="bg-dark-700 border border-white/10 rounded-2xl overflow-hidden">
              {/* AI notes */}
              {result.notes && (
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    {result.notes}
                  </p>
                </div>
              )}

              {result.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.estimatedQuantity}</p>
                    <p className="text-xs text-gray-600">
                      P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g
                      <span className={`ml-1.5 ${item.confidence === 'high' ? 'text-green-500' : item.confidence === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                        · {item.confidence} confidence
                      </span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">{item.calories}</p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                  <button
                    onClick={() => handleAddItem(item, i)}
                    disabled={adding[i]}
                    className="w-8 h-8 rounded-xl bg-brand-500/20 hover:bg-brand-500/40 text-brand-500 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    {adding[i] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}

              {/* Add all */}
              <div className="p-3">
                <button
                  onClick={handleAddAll}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  Add all items ({result.totalCalories} kcal total)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}