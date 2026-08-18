import { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/notifications', { params: { limit: 50 } });
      setNotifications(data.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (notification) => {
    await api.patch(`/notifications/${notification.id}/read`);
    showToast('Notification marked read.');
    load();
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    showToast('All notifications marked read.');
    load();
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description="View system notifications and mark them as read."
        actions={
          <Button variant="secondary" icon={FiCheckCircle} onClick={markAllRead}>
            Mark all read
          </Button>
        }
      />
      {loading ? <LoadingSpinner /> : null}
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {!loading && !notifications.length ? <EmptyState /> : null}
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{ animationDelay: `${index * 40}ms` }}
            className={`animate-fade-up rounded-lg border p-4 transition hover:shadow-soft ${
              notification.is_read
                ? 'border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900'
                : 'border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10'
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-ink-950 dark:text-white">{notification.title}</h2>
                  <Badge value={notification.type} />
                  {!notification.is_read ? <Badge>Unread</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{notification.message}</p>
                <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">{formatDate(notification.created_at)}</p>
              </div>
              {!notification.is_read ? (
                <Button size="sm" variant="secondary" onClick={() => markRead(notification)}>
                  Mark read
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
