import QuoteCard from "./QuoteCard";
import "../../styles/quotes/QuotesList.css";

function QuotesList({ quotes, onDelete, onUpdate, isAdding = false }) {
  if (!quotes.length) {
    if (isAdding) return null;
    return <p className="no-quotes">No quotes for this book yet.</p>;
  }

  return (
    <>
      <div className="quotes-count">
        Total quotes: {quotes.length}
      </div>
      <div className="quotes-list">
        {quotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </>
  );
}

export default QuotesList;
