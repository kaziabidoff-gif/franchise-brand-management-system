import { FiX } from 'react-icons/fi';
import Button from './Button';

export default function Modal({ open, title, children, footer, onClose, size = 'lg' }) {
  if (!open) {
    return null;
  }

  const width = size === 'xl' ? 'max-w-5xl' : size === 'md' ? 'max-w-2xl' : 'max-w-3xl';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm">
      <div className={`animate-pop-in max-h-[90vh] w-full overflow-hidden rounded-lg bg-white/95 shadow-2xl backdrop-blur-xl dark:bg-ink-900/95 ${width}`}>
        <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-700">
          <h2 className="text-lg font-bold text-ink-900 dark:text-white">{title}</h2>
          <button
            className="rounded-md p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>
        <div className="max-h-[calc(90vh-9rem)] overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-3 border-t border-ink-200 px-5 py-4 dark:border-ink-700">{footer}</div> : null}
      </div>
    </div>
  );
}

export const ConfirmDialog = ({ open, title = 'Confirm action', message, onCancel, onConfirm, loading }) => (
  <Modal
    open={open}
    title={title}
    onClose={onCancel}
    size="md"
    footer={
      <>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          Confirm
        </Button>
      </>
    }
  >
    <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{message}</p>
  </Modal>
);
