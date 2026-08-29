import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiImage, FiMapPin, FiPaperclip } from 'react-icons/fi';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';

// Matches the same due-date comparison TodoList uses, so "overdue" means the
// same thing everywhere in the dashboard.
const isOverdue = (task) => {
  if (!task.due_date || task.status === 'approved' || task.status === 'rejected') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.due_date);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
};

const priorityStripClass = {
  urgent: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-indigo-500',
  low: 'border-l-ink-300 dark:border-l-ink-600'
};

// Graphic Designer - work actually assigned to them. Each task gets its own
// card (not a thin list row) so priority, status, and deadline are all
// visible at a glance without opening anything.
export default function DesignTasks({ section }) {
  const tasks = section.tasks || [];

  return (
    <section className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-950 dark:text-white">
          <FiImage className="text-brand-600 dark:text-brand-400" />
          My Design Tasks
        </h2>
        <Badge>{`${tasks.length} open`}</Badge>
      </div>

      {tasks.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-ink-300 bg-ink-50/60 p-6 text-center text-sm text-ink-500 dark:border-ink-700 dark:bg-ink-800/60 dark:text-ink-400">
          Nothing assigned to you right now.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tasks.map((task) => {
            const overdue = isOverdue(task);
            return (
              <div
                key={task.id}
                className={`flex flex-col justify-between rounded-lg border border-l-4 border-ink-200 bg-ink-50/60 p-4 dark:border-ink-700 dark:bg-ink-800/60 ${
                  priorityStripClass[task.priority] || priorityStripClass.medium
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-ink-900 dark:text-white">{task.title}</p>
                    <Badge value={task.status} />
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-ink-500 dark:text-ink-400">
                    <p className="flex items-center gap-1.5">
                      <FiMapPin className="h-3.5 w-3.5 shrink-0" />
                      {task.branch_name || 'Unassigned branch'}
                      {task.category ? ` · ${task.category}` : ''}
                    </p>
                    {task.asset_title ? (
                      <p className="flex items-center gap-1.5">
                        <FiPaperclip className="h-3.5 w-3.5 shrink-0" />
                        {task.asset_title}
                      </p>
                    ) : null}
                    {task.due_date ? (
                      <p className={`flex items-center gap-1.5 ${overdue ? 'font-semibold text-red-600 dark:text-red-400' : ''}`}>
                        <FiClock className="h-3.5 w-3.5 shrink-0" />
                        {overdue ? 'Overdue since' : 'Due'} {formatDate(task.due_date)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <Badge value={task.priority} />
                  <Link to="/requests">
                    <Button size="sm" variant="secondary" icon={FiArrowRight}>
                      Open
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
