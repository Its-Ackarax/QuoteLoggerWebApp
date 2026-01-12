import BookCard from "./BookCard";
import "../../styles/books/BookGrid.css";

function BookGrid({ books, limit = null }) {
  if (!books || !books.length) {
    return <p>No books found.</p>;
  }

  let displayBooks = [...books].sort((a, b) => {
    const t1 = (a.title || "").toString();
    const t2 = (b.title || "").toString();
    return t1.localeCompare(t2, undefined, { sensitivity: "base" });
  });

  if (limit !== null && limit > 0) {
    displayBooks = displayBooks.slice(0, limit);
  }

  return (
    <div className="book-grid">
      {displayBooks.map((book, index) => (
        <BookCard key={index} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;