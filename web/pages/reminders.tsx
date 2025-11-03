import useSWR from 'swr';
import { API_BASE_URL, apiPost } from '../lib/api';
import Layout from '../components/Layout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Reminders() {
  const { data, mutate, error } = useSWR(`${API_BASE_URL}/api/reminders`, fetcher);

  if (error) return <Layout><div className="p-6">Failed to load</div></Layout>;
  if (!data) return <Layout><div className="p-6">Loading…</div></Layout>;

  async function markSent(id: string) {
    await apiPost(`/api/reminders/${id}/mark-sent`, {});
    mutate();
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold">Due Reminders</h2>
        {data.length === 0 && <p className="mt-4 text-gray-600 dark:text-gray-300">No reminders due right now.</p>}
        <div className="mt-4 space-y-3">
          {data.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
              <div>
                <div className="font-medium">{r.customerName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">₹{r.amount.toLocaleString('en-IN')} — {r.reason}{r.pdcDate ? ` — PDC ${new Date(r.pdcDate).toLocaleDateString()}` : ''}</div>
              </div>
              <button className="btn btn-primary" onClick={() => markSent(r.id)}>Mark Sent</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}


