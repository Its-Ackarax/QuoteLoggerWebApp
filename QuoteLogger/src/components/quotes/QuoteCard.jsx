import "../../styles/quotes/QuoteCard.css";

function QuoteCard({ quote, onDelete }) {
  return (
    <div className="quote-card">
      <blockquote>“{quote.text}”</blockquote>

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
