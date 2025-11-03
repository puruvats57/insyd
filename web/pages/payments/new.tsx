import { useState } from 'react';
import { apiPost } from '../../lib/api';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function NewPayment() {
  const router = useRouter();
  const [type, setType] = useState<'cheque' | 'cash'>('cheque');
  const [form, setForm] = useState<any>({
    customerId: '',
    customerName: '',
    amount: 0,
    chequeNumber: '',
    bankName: '',
    branch: '',
    pdcDate: '',
    cashReceiptNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { type, ...form, amount: Number(form.amount) };
      if (type === 'cheque' && form.pdcDate) payload.pdcDate = new Date(form.pdcDate).toISOString();
      const created = await apiPost('/api/payments', payload);
      router.push(`/payments/${created._id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold">New Payment</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          <div className="grid gap-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">Type</label>
            <select className="rounded-md border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-900" value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="cheque">cheque</option>
              <option value="cash">cash</option>
            </select>
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">Customer ID</label>
            <input className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">Customer Name</label>
            <input className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">Amount</label>
            <input className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>

          {type === 'cheque' && (
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="grid gap-1">
                <label className="text-sm text-gray-600 dark:text-gray-300">Cheque Number</label>
                <input className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" value={form.chequeNumber} onChange={(e) => setForm({ ...form, chequeNumber: e.target.value })} />
              </div>
              <div className="mt-3 grid gap-1">
                <label className="text-sm text-gray-600 dark:text-gray-300">Bank Name</label>
                <input className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
              </div>
              <div className="mt-3 grid gap-1">
                <label className="text-sm text-gray-600 dark:text-gray-300">Branch</label>
                <input className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
              </div>
              <div className="mt-3 grid gap-1">
                <label className="text-sm text-gray-600 dark:text-gray-300">PDC Date</label>
                <input className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" type="date" value={form.pdcDate} onChange={(e) => setForm({ ...form, pdcDate: e.target.value })} />
              </div>
            </div>
          )}

          {type === 'cash' && (
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="grid gap-1">
                <label className="text-sm text-gray-600 dark:text-gray-300">Cash Receipt Number</label>
                <input className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" value={form.cashReceiptNumber} onChange={(e) => setForm({ ...form, cashReceiptNumber: e.target.value })} />
              </div>
            </div>
          )}

          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Create'}</button>
        </form>
      </div>
    </Layout>
  );
}


