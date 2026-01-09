function QuoteCard({ quote, onDelete }) {
  return (
    <div className="quote-card">
      <blockquote>“{quote.text}”</blockquote>

      {quote.page && (
        <span className="quote-page">Page {quote.page}</span>
      )}

      {quote.reflection && (
        <p className="quote-reflection">{quote.reflection}</p>
      )}

      <div className="quote-actions">
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
