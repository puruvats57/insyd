import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h1 className="text-2xl font-semibold">Cheque & Cash Collections</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Track PDCs, reduce bounces, and accelerate cash conversion cycles.</p>
          <div className="mt-4 flex gap-3">
            <Link className="btn btn-primary" href="/payments/new">New Payment</Link>
            <Link className="btn btn-secondary" href="/payments">View Payments</Link>
            <Link className="btn btn-secondary" href="/reminders">Reminders</Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-500">Pre-PDC reminders</div>
            <div className="mt-1 text-2xl font-semibold">Automated queue</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-500">Bounce handling</div>
            <div className="mt-1 text-2xl font-semibold">One-click playbook</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="text-sm text-gray-500">Risk flags</div>
            <div className="mt-1 text-2xl font-semibold">Simple, clear labels</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


