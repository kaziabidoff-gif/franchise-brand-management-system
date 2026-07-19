import { FiX } from 'react-icons/fi';
import Button from './Button';

export default function Modal({ open, title, children, footer, onClose, size = 'lg' }) {
  if (!open) {
    return null;
  }

  const width = size === 'xl' ? 'max-w-5xl' : size === 'md' ? 'max-w-2xl' : 'max-w-3xl';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4">
      <div className={`max-h-[90vh] w-full overflow-hidden rounded-lg bg-white shadow-2xl ${width}`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>
        <div className="max-h-[calc(90vh-9rem)] overflow-y-auto px-5 py-5">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4">{footer}</div> : null}
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
    <p className="text-sm leading-6 text-slate-600">{message}</p>
  </Modal>
);
