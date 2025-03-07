import { recommendBusinessStructure } from '../services/companyService.js';

router.post('/structure-recommendation', protect, async (req, res) => {
  try {
    const { revenue, industry } = req.body;
    const recommendation = await recommendBusinessStructure(revenue, industry);
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});