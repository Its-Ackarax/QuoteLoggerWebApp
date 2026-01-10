import QuoteCard from "./QuoteCard";
import "../../styles/quotes/QuotesList.css";

function QuotesList({ quotes, onDelete, isAdding = false }) {
  if (!quotes.length) {
    // When the user is in the process of adding a quote, hide the empty state
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
          />
        ))}
      </div>
    </>
  );
}

export default QuotesList;
