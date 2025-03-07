import RegulatoryAlert from '../models/regulatory.js';

const TEST_USER_ID = '65bf631dc5b35d8d259a81c1';

export const getAlerts = async (req, res) => {
  try {
    const alerts = await RegulatoryAlert.find({ userId: TEST_USER_ID });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAlert = async (req, res) => {
  try {
    const alert = new RegulatoryAlert({
      ...req.body,
      userId: TEST_USER_ID
    });
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAlert = async (req, res) => {
  try {
    const alert = await RegulatoryAlert.findOneAndUpdate(
      { _id: req.params.id, userId: TEST_USER_ID },
      req.body,
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAlert = async (req, res) => {
  try {
    const alert = await RegulatoryAlert.findOneAndDelete({
      _id: req.params.id,
      userId: TEST_USER_ID
    });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpdates = async (req, res) => {
  try {
    const updates = await RegulatoryAlert.find({ 
      userId: TEST_USER_ID,
      type: 'update'
    }).sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
