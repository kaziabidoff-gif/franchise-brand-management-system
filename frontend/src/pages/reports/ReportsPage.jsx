import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/cards/StatCard';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import api from '../../services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/reports');
      setReports(data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Operational reports for requests, campaigns, assets, and branch activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={reports.totals.users} tone="blue" />
        <StatCard label="Branches" value={reports.totals.branches} tone="green" />
        <StatCard label="Assets" value={reports.totals.assets} tone="violet" />
        <StatCard label="Campaigns" value={reports.totals.campaigns} tone="amber" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <ReportPanel title="Request status">
          <SimpleBarChart data={reports.requestStatuses} />
        </ReportPanel>
        <ReportPanel title="Campaign status">
          <SimpleBarChart data={reports.campaignStatuses} />
        </ReportPanel>
        <ReportPanel title="Asset categories">
          <SimpleBarChart data={reports.assetCategories} />
        </ReportPanel>
        <ReportPanel title="Branch request activity">
          <SimpleBarChart data={reports.branchActivity} />
        </ReportPanel>
      </div>
    </div>
  );
}

const ReportPanel = ({ title, children }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5">
    <h2 className="mb-4 text-lg font-bold text-slate-950">{title}</h2>
    {children}
  </section>
);
