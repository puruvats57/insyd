import { useRouter } from 'next/router';
import useSWR from 'swr';
import { API_BASE_URL, apiPost, apiPatch } from '../../lib/api';
import Layout from '../../components/Layout';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    created: 'badge badge-blue',
    deposited: 'badge badge-yellow',
    cleared: 'badge badge-green',
    bounced: 'badge badge-red',
  };
  return <span className={map[status] || 'badge'}>{status}</span>;
}

export default function PaymentDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const { data, mutate } = useSWR(id ? `${API_BASE_URL}/api/payments/${id}` : null, fetcher);

  if (!id) return null;
  if (!data) return <Layout><div className="p-6">Loading…</div></Layout>;

  async function setStatus(action: 'deposit' | 'clear' | 'bounce') {
    if (action === 'bounce') {
      const reason = prompt('Bounce reason?') || 'unspecified';
      const charges = Number(prompt('Bounce charges?') || '0');
      await apiPost(`/api/payments/${id}/bounce`, { reason, charges });
    } else if (action === 'deposit') {
      await apiPost(`/api/payments/${id}/deposit`, {});
    } else {
      await apiPost(`/api/payments/${id}/clear`, {});
    }
    mutate();
  }

  async function saveNotes() {
    const notes = prompt('Notes', data.notes || '') || '';
    await apiPatch(`/api/payments/${id}`, { notes });
    mutate();
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold">Payment</h2>
        <div className="mt-4 grid gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="grid gap-1 md:grid-cols-2">
            <div><span className="text-gray-500">Customer</span><div className="font-medium">{data.customerName} ({data.customerId})</div></div>
            <div><span className="text-gray-500">Amount</span><div className="font-medium">₹{data.amount.toLocaleString('en-IN')}</div></div>
            <div><span className="text-gray-500">Type</span><div className="capitalize">{data.type}</div></div>
            <div><span className="text-gray-500">Status</span><div><Badge status={data.status} /></div></div>
            {data.pdcDate && <div><span className="text-gray-500">PDC Date</span><div>{new Date(data.pdcDate).toLocaleDateString()}</div></div>}
            {data.chequeNumber && <div><span className="text-gray-500">Cheque No</span><div>{data.chequeNumber}</div></div>}
            {data.bankName && <div><span className="text-gray-500">Bank</span><div>{data.bankName}</div></div>}
            {data.branch && <div><span className="text-gray-500">Branch</span><div>{data.branch}</div></div>}
            {data.cashReceiptNumber && <div><span className="text-gray-500">Cash Receipt</span><div>{data.cashReceiptNumber}</div></div>}
            <div><span className="text-gray-500">Risk</span><div className="capitalize">{data.riskLabel} ({data.riskScore})</div></div>
            {data.notes && <div className="md:col-span-2"><span className="text-gray-500">Notes</span><div>{data.notes}</div></div>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-secondary" onClick={() => setStatus('deposit')}>Mark Deposited</button>
            <button className="btn btn-secondary" onClick={() => setStatus('clear')}>Mark Cleared</button>
            <button className="btn btn-secondary" onClick={() => setStatus('bounce')}>Mark Bounced</button>
            <button className="btn btn-primary" onClick={saveNotes}>Edit Notes</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}


