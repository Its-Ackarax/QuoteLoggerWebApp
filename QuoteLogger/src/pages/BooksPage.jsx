import { useBooks } from "../context/BooksContext";
import BookGrid from "../components/books/BookGrid";
import "../styles/BooksPage.css";

function BooksPage() {
  const { books } = useBooks();

  return (
    <div className="books-page">
      <h1>My Books</h1>
      <p>Total books saved: {books.length}</p>

      {books.length === 0 ? (
        <p>No books saved yet.</p>
      ) : (
        <BookGrid books={books} />
      )}
    </div>
  );
}

export default BooksPage;