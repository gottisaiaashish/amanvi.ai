import { Router } from 'express';
import Task from '../models/Task.js';

const router = Router();

// @route   GET /api/tasks
// @desc    Get all tasks sorted by due date
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, type, priority, dueDate } = req.body;
    
    // For now, we mock the user since there's no auth middleware
    const User = (await import('../models/User.js')).default;
    let user = await User.findOne();
    
    if (!user) {
      user = await User.create({ name: 'Ashish', email: 'ashish@amanvi.ai' });
    }

    const newTask = new Task({
      user: user._id,
      title,
      description,
      status: 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || new Date(),
      isAutoCreated: true
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

export default router;
