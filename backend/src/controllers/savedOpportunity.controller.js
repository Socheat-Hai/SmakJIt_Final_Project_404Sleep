const savedService = require('../services/savedOpportunity.service');

// GET /saved - list saved opportunities for current user
const list = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const saved = await savedService.findByUser(userId);
    // Return array of opportunity objects with necessary fields
    const result = saved.map((s) => s.opportunity);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /saved/:oppId - add saved opportunity
const add = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const oppId = parseInt(req.params.oppId);
    await savedService.create(userId, oppId);
    res.status(201).json({ message: 'Saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /saved/:oppId - remove saved opportunity
const remove = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const oppId = parseInt(req.params.oppId);
    await savedService.remove(userId, oppId);
    res.json({ message: 'Unsaved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { list, add, remove };