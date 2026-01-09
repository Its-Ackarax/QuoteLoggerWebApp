function QuotesSidebar({
  bookKeys,
  quotes,
  selectedBookKey,
  setSelectedBookKey,
  books
}) {
  return (
    <aside className="quotes-sidebar">
      <h2>Books</h2>

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
    </aside>
  );
}

export default QuotesSidebar;
