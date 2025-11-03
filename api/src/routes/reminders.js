import { Router } from 'express';
import Payment from '../models/Payment.js';

const router = Router();

// Compute due reminders on-the-fly
function isPrePdcReminderDue(payment) {
  if (payment.type !== 'cheque') return false;
  if (!payment.pdcDate) return false;
  const today = new Date();
  const d = new Date(payment.pdcDate);
  const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
  return diffDays === 2 || diffDays === 1; // 2 or 1 days before PDC
}

function isPostDepositReminderDue(payment) {
  if (payment.status !== 'deposited') return false;
  const today = new Date();
  const d = payment.depositedAt ? new Date(payment.depositedAt) : null;
  if (!d) return false;
  const diffDays = Math.ceil((today - d) / (1000 * 60 * 60 * 24));
  return diffDays === 1; // next day after deposit
}

router.get('/', async (_req, res) => {
  try {
    const recent = await Payment.find({ createdAt: { $gte: new Date(Date.now() - 90 * 86400000) } })
      .sort({ createdAt: -1 })
      .limit(500);

    const due = recent
      .filter((p) => p.reminderPreference !== 'none')
      .filter((p) => {
        const pre = (p.reminderPreference === 'pre_pdc' || p.reminderPreference === 'both') && isPrePdcReminderDue(p);
        const post = (p.reminderPreference === 'post_deposit' || p.reminderPreference === 'both') && isPostDepositReminderDue(p);
        return pre || post;
      })
      .map((p) => ({
        id: p._id,
        customerName: p.customerName,
        amount: p.amount,
        type: p.type,
        status: p.status,
        pdcDate: p.pdcDate,
        depositedAt: p.depositedAt,
        reason: isPrePdcReminderDue(p) ? 'pre_pdc' : 'post_deposit',
      }));

    return res.json(due);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to compute reminders' });
  }
});

router.post('/:id/mark-sent', async (req, res) => {
  try {
    const p = await Payment.findByIdAndUpdate(req.params.id, { lastReminderAt: new Date() }, { new: true });
    if (!p) return res.status(404).json({ error: 'Not found' });
    return res.json(p);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to mark reminder sent' });
  }
});

export default router;


