import { createPortal } from "react-dom";
import "../../styles/modals/DeleteBookModal.css";

function DeleteBookModal({ isOpen, onClose, onConfirm, bookTitle, quoteCount }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Remove Book</h3>
        <p>
          Are you sure you want to remove <strong>{bookTitle}</strong> from your list?
        </p>
        {quoteCount > 0 && (
          <p className="warning-message">
            ⚠️ This book has {quoteCount} saved {quoteCount === 1 ? "quote" : "quotes"}.{" "}
            Removing this book will also delete all associated quotes. This action cannot be undone.
          </p>
        )}
        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn confirm-btn" onClick={onConfirm}>
            Remove Book
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default DeleteBookModal;