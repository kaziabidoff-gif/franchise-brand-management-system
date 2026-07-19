import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import RequestForm from '../../components/requests/RequestForm';
import { buildRequestPayload, createRequest } from '../../services/request.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const submit = async (values, referenceFile) => {
    setSaving(true);
    try {
      const body = { ...values, branch_id: user?.branch_id };
      const { payload, hasFile } = buildRequestPayload(body, referenceFile);
      const created = await createRequest(payload, hasFile);
      showToast('Customization request submitted.');
      navigate(`/requests/${created.id}`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to submit request.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title="New Customization Request"
        description="Tell headquarters what you'd like customized for your branch."
      />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <RequestForm onSubmit={submit} onCancel={() => navigate('/requests')} loading={saving} />
      </div>
    </div>
  );
}
