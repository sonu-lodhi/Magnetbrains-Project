
const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Create Task
router.post('/create', authMiddleware, async (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  
  try {
    const task = new Task({ title, description, dueDate, priority, userId: req.userId });
    await task.save();
    res.status(201).json({ message: 'Task created successfully1', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Get All Tasks (Pagination)
router.get('/', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  try {
    const tasks = await Task.find({ userId: req.userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    
    const totalTasks = await Task.countDocuments({ userId: req.userId });
    res.status(200).json({ tasks, totalTasks });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Task
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate, priority, status },
      { new: true }
    );
    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Task
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change Task Status
router.put('/status/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ message: 'Task status updated', task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

