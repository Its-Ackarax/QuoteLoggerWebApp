import "../../styles/quotes/QuotesSidebar.css";

function QuotesSidebar({
  bookKeys,
  quotes,
  selectedBookKey,
  setSelectedBookKey,
  books,
  isOpen = true,
  onClose
}) {
  return (
    <aside className={`quotes-sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-container">
        <div className="quotes-sidebar-header">
          <h2 className="quotes-sidebar-title">Books</h2>
          <div className="sidebar-books-count-badge">
            <span className="sidebar-count-number">{bookKeys.length}</span>
          </div>
          {onClose && (
            <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {books.length === 0 && (
          <p>Add books to favourites to start logging quotes</p>
        )}

        <ul>
          {bookKeys.map((key) => {
            const [title, author] = key.split("|");
            const count = (quotes[key] || []).length;

            return (
              <li
                key={key}
                className={key === selectedBookKey ? "active" : ""}
                onClick={() => setSelectedBookKey(key)}
              >
                <div className="book-list-line">
                  <strong>{title}</strong>
                  <span className="book-quote-count">{count}</span>
                </div>
                <span className="book-author">{author}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default QuotesSidebar;
