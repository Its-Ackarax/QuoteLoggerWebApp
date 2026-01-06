import BookCard from "./BookCard";
import "../../styles/BookGrid.css";

function BookGrid({ books }) {
  if (!books || !books.length) {
    return <p>No books found.</p>;
  }

  // show up to 15 books so grid forms 3 rows x 5 columns when possible
  const displayBooks = [...books]
    .sort((a, b) => {
      const t1 = (a.title || "").toString();
      const t2 = (b.title || "").toString();
      return t1.localeCompare(t2, undefined, { sensitivity: "base" });
    })
    .slice(0, 15);

  return (
    <div className="book-grid">
      {displayBooks.map((book, index) => (
        <BookCard key={index} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;