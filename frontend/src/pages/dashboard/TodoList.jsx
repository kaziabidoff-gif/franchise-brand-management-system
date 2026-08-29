import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiFlag, FiPlus, FiTrash2 } from 'react-icons/fi';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import Tooltip from '../../components/common/Tooltip';
import { useToast } from '../../context/ToastContext';
import { clearCompletedTodos, createTodo, deleteTodo, listTodos, updateTodo } from '../../services/todo.service';
import { formatDate } from '../../utils/formatters';

// due_date comes back as a plain "YYYY-MM-DD" DATE value (no time component),
// so compare it against today's date at the same granularity rather than
// against `new Date()`, which would flag "due today" as overdue once the
// clock ticks past midnight local time on the client but not on the server.
const isOverdue = (todo) => {
  if (!todo.due_date || todo.is_done) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(todo.due_date);
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
};

const PRIORITIES = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

const priorityFlagClass = {
  urgent: 'text-red-600 dark:text-red-400',
  high: 'text-orange-600 dark:text-orange-400',
  medium: 'text-indigo-600 dark:text-indigo-400',
  low: 'text-ink-400 dark:text-ink-500'
};

function PriorityPicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const current = PRIORITIES.find((item) => item.value === value) || PRIORITIES[2];

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-md border border-ink-200 bg-white px-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800"
      >
        <FiFlag className={`h-4 w-4 ${priorityFlagClass[current.value]}`} />
        {current.label}
        <FiChevronDown className="h-3.5 w-3.5 text-ink-400" />
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-1 w-36 rounded-md border border-ink-200 bg-white p-1 shadow-soft dark:border-ink-700 dark:bg-ink-900">
          {PRIORITIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm font-medium transition hover:bg-ink-100 dark:hover:bg-ink-800 ${
                item.value === current.value ? 'text-ink-900 dark:text-white' : 'text-ink-600 dark:text-ink-300'
              }`}
            >
              <FiFlag className={`h-3.5 w-3.5 ${priorityFlagClass[item.value]}`} />
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function TodoList() {
  const { showToast } = useToast();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await listTodos();
      setTodos(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your to-dos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setAdding(true);
    try {
      await createTodo({ title: trimmed, priority, due_date: dueDate || undefined });
      setTitle('');
      setDueDate('');
      setPriority('medium');
      await load();
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Could not add that to-do.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const toggleDone = async (todo) => {
    setBusyId(todo.id);
    try {
      await updateTodo(todo.id, { is_done: !todo.is_done });
      await load();
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Could not update that to-do.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const changePriority = async (todo, nextPriority) => {
    if (nextPriority === todo.priority) return;
    setBusyId(todo.id);
    try {
      await updateTodo(todo.id, { priority: nextPriority });
      await load();
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Could not update that to-do.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (todo) => {
    setBusyId(todo.id);
    try {
      await deleteTodo(todo.id);
      setTodos((current) => current.filter((item) => item.id !== todo.id));
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Could not remove that to-do.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const clearCompleted = async () => {
    try {
      await clearCompletedTodos();
      setTodos((current) => current.filter((item) => !item.is_done));
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Could not clear completed to-dos.', 'error');
    }
  };

  const openCount = todos.filter((item) => !item.is_done).length;
  const hasCompleted = todos.some((item) => item.is_done);

  return (
    <section className="rounded-lg border border-ink-200 bg-white p-5 dark:border-ink-700 dark:bg-ink-900">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink-950 dark:text-white">My To-Dos</h2>
        {!loading && !error ? <Badge>{`${openCount} open`}</Badge> : null}
      </div>

      <form onSubmit={handleAdd} className="mt-4 space-y-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a to-do…"
          maxLength={255}
          className="h-12 w-full rounded-md border border-ink-200 bg-white px-4 text-base text-ink-800 outline-none placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:placeholder:text-ink-500 dark:focus:border-brand-400 dark:focus:ring-brand-900"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <PriorityPicker value={priority} onChange={setPriority} disabled={adding} />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="h-12 flex-1 rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:focus:border-brand-400 dark:focus:ring-brand-900"
          />
          <button
            type="submit"
            disabled={adding || !title.trim()}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-md bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus:ring-brand-900"
          >
            <FiPlus className="h-4 w-4" />
            Add
          </button>
        </div>
      </form>

      <div className="mt-4">
        {loading ? (
          <LoadingSpinner label="Loading your to-dos" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : !todos.length ? (
          <p className="rounded-md border border-dashed border-ink-300 bg-ink-50/60 p-4 text-center text-sm text-ink-500 dark:border-ink-700 dark:bg-ink-800/60 dark:text-ink-400">
            Nothing on your list yet. Add your first to-do above.
          </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => {
              const overdue = isOverdue(todo);
              return (
                <li
                  key={todo.id}
                  className={`flex items-center gap-3 rounded-md border px-3 py-2.5 transition-colors ${
                    overdue
                      ? 'border-red-200 bg-red-50/70 dark:border-red-900/60 dark:bg-red-950/30'
                      : 'border-ink-100 bg-ink-50/60 dark:border-ink-700 dark:bg-ink-800/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleDone(todo)}
                    disabled={busyId === todo.id}
                    aria-label={todo.is_done ? 'Mark as not done' : 'Mark as done'}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      todo.is_done
                        ? 'border-brand-600 bg-brand-600 text-white dark:border-brand-500 dark:bg-brand-500'
                        : 'border-ink-300 text-transparent hover:border-brand-400 dark:border-ink-600'
                    }`}
                  >
                    <FiCheck className="h-3.5 w-3.5" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <Tooltip
                      content={{
                        trigger: (
                          <p
                            className={`truncate text-sm font-semibold ${
                              todo.is_done
                                ? 'text-ink-400 line-through dark:text-ink-500'
                                : overdue
                                  ? 'text-red-700 dark:text-red-400'
                                  : 'text-ink-800 dark:text-ink-100'
                            }`}
                          >
                            {todo.title}
                          </p>
                        ),
                        full: todo.title
                      }}
                    />
                    {todo.source_type === 'customization_request' ? (
                      <span className="mt-0.5 inline-block rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                        Design task
                      </span>
                    ) : null}
                    {todo.due_date ? (
                      <p
                        className={`text-xs ${
                          overdue ? 'font-semibold text-red-600 dark:text-red-400' : 'text-ink-500 dark:text-ink-400'
                        }`}
                      >
                        {overdue ? 'Overdue since' : 'Due'} {formatDate(todo.due_date)}
                      </p>
                    ) : null}
                  </div>
                  <PriorityPicker
                    value={todo.priority}
                    onChange={(next) => changePriority(todo, next)}
                    disabled={busyId === todo.id}
                  />
                  <button
                    type="button"
                    onClick={() => remove(todo)}
                    disabled={busyId === todo.id}
                    aria-label={`Delete ${todo.title}`}
                    className="shrink-0 rounded-md p-1.5 text-ink-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-ink-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {hasCompleted ? (
        <button
          type="button"
          onClick={clearCompleted}
          className="mt-3 text-xs font-semibold text-ink-500 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400"
        >
          Clear completed
        </button>
      ) : null}
    </section>
  );
}
