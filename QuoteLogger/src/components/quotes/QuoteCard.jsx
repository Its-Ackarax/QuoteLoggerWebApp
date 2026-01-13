import { useState } from "react";
import "../../styles/quotes/QuoteCard.css";
import AddQuoteForm from "./AddQuoteForm";

function QuoteCard({ quote, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleEditSubmit(quoteData) {
    onUpdate(quote.id, quoteData);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="quote-card">
        <AddQuoteForm
          onSubmit={handleEditSubmit}
          initialText={quote.text}
          initialPage={quote.page}
          initialReflection={quote.reflection}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="quote-card">
      <blockquote>"{quote.text}"</blockquote>

      {quote.page && (
        <span className="quote-page">Page {quote.page}</span>
      )}

      {quote.reflection && (
        <div className="quote-reflection">
          <span className="quote-reflection-label">Your thoughts:</span>
          <p className="quote-reflection-text">{quote.reflection}</p>
        </div>
      )}

      <div className="quote-actions">
        <button
          className="edit-quote-btn"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className="delete-quote-btn"
          onClick={() => onDelete(quote.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default QuoteCard;
