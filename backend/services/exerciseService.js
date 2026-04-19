const axios = require('axios');
const Exercise = require('../models/Exercise');

const BASE_URL = 'https://exercisedb.dev/api/v1';
const BATCH_SIZE = 25; // API max per request

// Map exercisedb.dev response shape to our schema
const mapExercise = (ex) => {
  // Infer difficulty from instructions length / name keywords
  const name = (ex.name || '').toLowerCase();
  let difficulty = 'intermediate';
  if (name.includes('beginner') || ['plank', 'push-up', 'walking lunge', 'bicep curl', 'lateral raise'].some(k => name.includes(k))) {
    difficulty = 'beginner';
  } else if (name.includes('deadlift') || name.includes('snatch') || name.includes('clean') || name.includes('advanced')) {
    difficulty = 'advanced';
  }

  // Calories rough estimate by body part
  const calMap = { chest: 7, back: 8, 'upper legs': 9, shoulders: 5, waist: 4, cardio: 10, 'upper arms': 4, 'lower arms': 3, 'lower legs': 5 };
  const bodyPart = (ex.bodyParts?.[0] || '').toLowerCase();
  const caloriesPerMinute = calMap[bodyPart] || 6;

  return {
    exerciseId: ex.exerciseId,
    name: ex.name,
    bodyPart,
    equipment: (ex.equipments?.[0] || 'body weight').toLowerCase(),
    gifUrl: ex.gifUrl || '',           // direct loadable URL from exercisedb.dev
    target: (ex.targetMuscles?.[0] || '').toLowerCase(),
    secondaryMuscles: ex.secondaryMuscles || [],
    instructions: ex.instructions || [],
    difficulty,
    caloriesPerMinute,
  };
};

// Fetch all exercises by paginating through the API
const syncFromAPI = async () => {
  console.log('Starting exercise sync from exercisedb.dev (no API key required)...');

  try {
    // Step 1: get first page to find total
    const first = await axios.get(`${BASE_URL}/exercises`, {
      params: { limit: BATCH_SIZE, offset: 0 },
      timeout: 15000,
    });

    const { totalExercises, totalPages } = first.data.metadata;
    console.log(`Total exercises available: ${totalExercises} across ${totalPages} pages`);

    let allExercises = [...first.data.data];

    // Step 2: fetch remaining pages in parallel (max 5 at a time to be polite)
    const pageNumbers = [];
    for (let page = 2; page <= Math.min(totalPages, 60); page++) {
      pageNumbers.push(page);
    }

    // Process in chunks of 5 concurrent requests
    const CONCURRENT = 5;
    for (let i = 0; i < pageNumbers.length; i += CONCURRENT) {
      const chunk = pageNumbers.slice(i, i + CONCURRENT);
      const results = await Promise.allSettled(
        chunk.map((page) =>
          axios.get(`${BASE_URL}/exercises`, {
            params: { limit: BATCH_SIZE, offset: (page - 1) * BATCH_SIZE },
            timeout: 15000,
          })
        )
      );

      for (const result of results) {
        if (result.status === 'fulfilled') {
          allExercises.push(...result.value.data.data);
        }
      }

      // Small delay between chunks to avoid rate limiting
      if (i + CONCURRENT < pageNumbers.length) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    console.log(`Fetched ${allExercises.length} exercises total — saving to MongoDB...`);

    // Step 3: upsert all into MongoDB
    const ops = allExercises
      .filter((ex) => ex.exerciseId)
      .map((ex) => ({
        updateOne: {
          filter: { exerciseId: ex.exerciseId },
          update: { $set: mapExercise(ex) },
          upsert: true,
        },
      }));

    if (ops.length > 0) {
      const result = await Exercise.bulkWrite(ops, { ordered: false });
      console.log(`Sync complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`);
    }
  } catch (err) {
    console.error('exercisedb.dev sync failed:', err.message);
    console.log('Falling back to seed data...');
    await seedFromFallback();
  }
};

// Minimal seed data — only used if the API is completely unreachable
const SEED_EXERCISES = [
  { exerciseId: 'seed_001', name: 'Push-Up', bodyPart: 'chest', equipment: 'body weight', target: 'pectorals', secondaryMuscles: ['triceps', 'core'], gifUrl: '', difficulty: 'beginner', caloriesPerMinute: 5, instructions: ['Start in a high plank, hands slightly wider than shoulders.', 'Lower your chest to the floor keeping elbows at 45°.', 'Push back to start in one controlled motion.'] },
  { exerciseId: 'seed_002', name: 'Pull-Up', bodyPart: 'back', equipment: 'body weight', target: 'lats', secondaryMuscles: ['biceps', 'rhomboids'], gifUrl: '', difficulty: 'intermediate', caloriesPerMinute: 8, instructions: ['Hang from bar palms facing away shoulder-width.', 'Pull until chin clears the bar.', 'Lower slowly to dead hang.'] },
  { exerciseId: 'seed_003', name: 'Barbell Back Squat', bodyPart: 'upper legs', equipment: 'barbell', target: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], gifUrl: '', difficulty: 'intermediate', caloriesPerMinute: 9, instructions: ['Bar on upper traps, feet shoulder-width.', 'Sit hips back until thighs parallel to floor.', 'Drive through heels to stand.'] },
  { exerciseId: 'seed_004', name: 'Plank', bodyPart: 'waist', equipment: 'body weight', target: 'abs', secondaryMuscles: ['glutes', 'shoulders'], gifUrl: '', difficulty: 'beginner', caloriesPerMinute: 3, instructions: ['Forearm plank, elbows under shoulders.', 'Keep body in a straight line head to heels.', 'Hold steady, do not let hips sag.'] },
  { exerciseId: 'seed_005', name: 'Deadlift', bodyPart: 'back', equipment: 'barbell', target: 'spine', secondaryMuscles: ['glutes', 'hamstrings', 'traps'], gifUrl: '', difficulty: 'advanced', caloriesPerMinute: 10, instructions: ['Bar over mid-foot, hip-width stance.', 'Hinge at hips, neutral spine, grip outside legs.', 'Drive through floor and lock out hips at top.'] },
  { exerciseId: 'seed_006', name: 'Dumbbell Bicep Curl', bodyPart: 'upper arms', equipment: 'dumbbell', target: 'biceps', secondaryMuscles: ['brachialis'], gifUrl: '', difficulty: 'beginner', caloriesPerMinute: 4, instructions: ['Stand holding dumbbells palms forward.', 'Curl toward shoulders squeezing at the top.', 'Lower slowly back to start.'] },
  { exerciseId: 'seed_007', name: 'Overhead Press', bodyPart: 'shoulders', equipment: 'barbell', target: 'delts', secondaryMuscles: ['triceps', 'traps'], gifUrl: '', difficulty: 'intermediate', caloriesPerMinute: 7, instructions: ['Bar at shoulder height overhand grip.', 'Press straight overhead until arms lock out.', 'Lower with control back to shoulders.'] },
  { exerciseId: 'seed_008', name: 'Romanian Deadlift', bodyPart: 'upper legs', equipment: 'barbell', target: 'hamstrings', secondaryMuscles: ['glutes', 'lower back'], gifUrl: '', difficulty: 'intermediate', caloriesPerMinute: 7, instructions: ['Hold bar at hip level, soft knee bend.', 'Hinge at hips lowering bar along legs.', 'Drive hips forward to stand.'] },
  { exerciseId: 'seed_009', name: 'Dumbbell Lateral Raise', bodyPart: 'shoulders', equipment: 'dumbbell', target: 'delts', secondaryMuscles: ['traps'], gifUrl: '', difficulty: 'beginner', caloriesPerMinute: 4, instructions: ['Stand with dumbbells at sides slight elbow bend.', 'Raise arms to the side until parallel to floor.', 'Lower slowly resist gravity.'] },
  { exerciseId: 'seed_010', name: 'Lat Pulldown', bodyPart: 'back', equipment: 'cable', target: 'lats', secondaryMuscles: ['biceps', 'teres major'], gifUrl: '', difficulty: 'beginner', caloriesPerMinute: 5, instructions: ['Sit at pulldown station overhand grip wider than shoulders.', 'Pull bar to upper chest leaning back slightly.', 'Extend arms with control back to start.'] },
];

const seedFromFallback = async () => {
  const count = await Exercise.countDocuments();
  if (count === 0) {
    await Exercise.insertMany(SEED_EXERCISES);
    console.log('Seeded 10 fallback exercises');
  }
};

module.exports = { syncFromAPI, seedFromFallback };