import { useState, useEffect, useCallback } from 'react';
import { Dumbbell, Heart, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import ExerciseCard from '../components/exercises/ExerciseCard';
import ExerciseModal from '../components/exercises/ExerciseModal';
import ExerciseFilters from '../components/exercises/ExerciseFilters';
import ExerciseSearch from '../components/exercises/ExerciseSearch';
import {
  fetchExercises,
  fetchFilterOptions,
  toggleFavorite,
  fetchFavorites,
} from '../api/exercises';

const TABS = [
  { key: 'all', label: 'All exercises', icon: Dumbbell },
  { key: 'favorites', label: 'My favorites', icon: Heart },
];

export default function ExercisesPage() {
  const [exercises, setExercises]     = useState([]);
  const [favorites, setFavorites]     = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [filterOptions, setFilterOptions] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeTab, setActiveTab]     = useState('all');
  const [loading, setLoading]         = useState(true);
  const [pagination, setPagination]   = useState({ page: 1, totalPages: 1, total: 0 });

  const [filters, setFilters] = useState({
    bodyPart: '', equipment: '', difficulty: '',
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Load filter options once
  useEffect(() => {
    fetchFilterOptions().then((d) => setFilterOptions(d.data));
    fetchFavorites().then((d) => {
      setFavorites(d.data);
      setFavoriteIds(new Set(d.data.map((e) => e._id)));
    });
  }, []);

  // Load exercises when filters / page change
  const loadExercises = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: 12,
      };
      if (debouncedSearch) params.search = debouncedSearch;

      const data = await fetchExercises(params);
      setExercises(data.data);
      setPagination((p) => ({ ...p, ...data.pagination }));
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, debouncedSearch]);

  useEffect(() => {
    if (activeTab === 'all') loadExercises();
  }, [loadExercises, activeTab]);

  const handleFilterChange = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ bodyPart: '', equipment: '', difficulty: '' });
    setSearch('');
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleFavorite = async (id) => {
    const { favorited } = await toggleFavorite(id);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      favorited ? next.add(id) : next.delete(id);
      return next;
    });
    // Refresh favorites list
    fetchFavorites().then((d) => setFavorites(d.data));
  };

  const displayedExercises = activeTab === 'favorites' ? favorites : exercises;

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Exercise library</h1>
          <p className="text-gray-400 text-sm">Browse, filter, and favourite exercises</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-dark-800 border border-white/10 rounded-xl w-fit mb-6">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {key === 'favorites' && favoriteIds.size > 0 && (
                <span className="bg-white/10 text-xs px-1.5 py-0.5 rounded-full">
                  {favoriteIds.size}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + Filters (only on All tab) */}
        {activeTab === 'all' && (
          <div className="space-y-3 mb-6">
            <ExerciseSearch value={search} onChange={(v) => { setSearch(v); setPagination((p) => ({ ...p, page: 1 })); }} />
            <ExerciseFilters
              filters={filters}
              options={filterOptions}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* Results count */}
        {activeTab === 'all' && !loading && (
          <p className="text-sm text-gray-500 mb-4">
            {pagination.total} exercise{pagination.total !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : displayedExercises.length === 0 ? (
          <div className="text-center py-20">
            <Dumbbell className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">
              {activeTab === 'favorites' ? 'No favourites yet' : 'No exercises found'}
            </p>
            {activeTab === 'all' && (
              <button onClick={handleClearFilters} className="text-brand-500 text-sm mt-2 hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayedExercises.map((exercise) => (
              <ExerciseCard
                key={exercise._id}
                exercise={exercise}
                isFavorited={favoriteIds.has(exercise._id)}
                onSelect={setSelectedExercise}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {activeTab === 'all' && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="w-9 h-9 rounded-xl bg-dark-800 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm text-gray-400">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="w-9 h-9 rounded-xl bg-dark-800 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Exercise detail modal */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          isFavorited={favoriteIds.has(selectedExercise._id)}
          onClose={() => setSelectedExercise(null)}
          onFavorite={handleFavorite}
        />
      )}
    </div>
  );
}