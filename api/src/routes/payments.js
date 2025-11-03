import { Router } from 'express';
import Payment from '../models/Payment.js';

const router = Router();

function computeRiskLabel(score) {
  if (score >= 70) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.type || !['cheque', 'cash'].includes(body.type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }
    if (!body.customerId || !body.customerName) {
      return res.status(400).json({ error: 'Missing customer details' });
    }
    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const riskScore = 10; // Placeholder: can derive from history
    const payment = await Payment.create({ ...body, riskScore, riskLabel: computeRiskLabel(riskScore) });
    return res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create payment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, type, customerId, q, from, to } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (customerId) filter.customerId = customerId;
    if (q) filter.$text = { $search: q };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const results = await Payment.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Not found' });
    return res.json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body || {};
    const payment = await Payment.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!payment) return res.status(404).json({ error: 'Not found' });
    return res.json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Status transitions
router.post('/:id/deposit', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Not found' });
    payment.status = 'deposited';
    payment.depositedAt = new Date();
    await payment.save();
    return res.json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update to deposited' });
  }
});

router.post('/:id/clear', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Not found' });
    payment.status = 'cleared';
    payment.clearedAt = new Date();
    await payment.save();
    return res.json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update to cleared' });
  }
});

router.post('/:id/bounce', async (req, res) => {
  try {
    const { reason, charges, nextActionDate } = req.body || {};
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Not found' });
    payment.status = 'bounced';
    payment.bouncedAt = new Date();
    payment.bounceReason = reason || 'unspecified';
    payment.bounceCharges = typeof charges === 'number' ? charges : 0;
    payment.nextActionDate = nextActionDate ? new Date(nextActionDate) : undefined;
    await payment.save();
    return res.json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update to bounced' });
  }
});

// Simple allocation update
router.post('/:id/allocate', async (req, res) => {
  try {
    const { allocations } = req.body || {};
    if (!Array.isArray(allocations)) return res.status(400).json({ error: 'allocations must be array' });
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { allocations },
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: 'Not found' });
    return res.json(payment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to set allocations' });
  }
});

export default router;


