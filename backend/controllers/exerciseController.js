const Exercise = require('../models/Exercise');
const UserFavorite = require('../models/UserFavorite');

// GET /api/exercises
const getExercises = async (req, res) => {
  try {
    const {
      bodyPart, equipment, target, difficulty,
      search, page = 1, limit = 20,
    } = req.query;

    const filter = {};
    if (bodyPart)    filter.bodyPart   = { $regex: new RegExp(bodyPart, 'i') };
    if (equipment)   filter.equipment  = { $regex: new RegExp(equipment, 'i') };
    if (target)      filter.target     = { $regex: new RegExp(target, 'i') };
    if (difficulty)  filter.difficulty = difficulty.toLowerCase();

    // Text search — search name and target muscle
    if (search) {
      filter.$or = [
        { name:   { $regex: new RegExp(search, 'i') } },
        { target: { $regex: new RegExp(search, 'i') } },
        { bodyPart: { $regex: new RegExp(search, 'i') } },
        { secondaryMuscles: { $elemMatch: { $regex: new RegExp(search, 'i') } } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const [exercises, total] = await Promise.all([
      Exercise.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ name: 1 })
        .lean(),
      Exercise.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: exercises,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/exercises/meta/filters
const getFilterOptions = async (req, res) => {
  try {
    const [bodyParts, equipment, targets, difficulties] = await Promise.all([
      Exercise.distinct('bodyPart'),
      Exercise.distinct('equipment'),
      Exercise.distinct('target'),
      Exercise.distinct('difficulty'),
    ]);
    res.status(200).json({
      success: true,
      data: {
        bodyParts:    bodyParts.filter(Boolean).sort(),
        equipment:    equipment.filter(Boolean).sort(),
        targets:      targets.filter(Boolean).sort(),
        difficulties: ['beginner', 'intermediate', 'advanced'],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/exercises/:id
const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).lean();
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }
    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/exercises/:id/favorite
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId  = req.user._id;
    const existing = await UserFavorite.findOne({ user: userId, exercise: id });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, favorited: false });
    }
    await UserFavorite.create({ user: userId, exercise: id });
    res.status(201).json({ success: true, favorited: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/exercises/user/favorites
const getUserFavorites = async (req, res) => {
  try {
    const favorites = await UserFavorite.find({ user: req.user._id })
      .populate('exercise')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      success: true,
      data: favorites.map((f) => f.exercise).filter(Boolean),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  getFilterOptions,
  toggleFavorite,
  getUserFavorites,
};