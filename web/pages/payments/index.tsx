import useSWR from 'swr';
import Link from 'next/link';
import { API_BASE_URL } from '../../lib/api';
import Layout from '../../components/Layout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    created: 'badge badge-blue',
    deposited: 'badge badge-yellow',
    cleared: 'badge badge-green',
    bounced: 'badge badge-red',
  };
  return <span className={map[status] || 'badge'}>{status}</span>;
}

export default function PaymentsList() {
  const { data, error } = useSWR(`${API_BASE_URL}/api/payments`, fetcher);

  if (error) return <Layout><div className="p-6">Failed to load</div></Layout>;
  if (!data) return <Layout><div className="p-6">Loading…</div></Layout>;

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payments</h2>
        <Link className="btn btn-primary" href="/payments/new">New Payment</Link>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">PDC Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p: any) => (
              <tr key={p._id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3">{p.customerName}</td>
                <td className="px-4 py-3 text-right">₹{p.amount.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 capitalize">{p.type}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">{p.pdcDate ? new Date(p.pdcDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3">
                  <Link className="text-brand-600 hover:underline" href={`/payments/${p._id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}


