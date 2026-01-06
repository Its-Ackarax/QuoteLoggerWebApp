import "../../styles/BookCard.css";
import { useBooks } from "../../context/BooksContext";
import { useQuotes } from "../../context/QuotesContext";
import { useNavigate } from "react-router-dom";

function BookCard({ book }) {

    const { addBook, removeBook, isBookSaved } = useBooks();
    const { addQuote } = useQuotes();
    const saved = isBookSaved(book);
    const navigate = useNavigate();

    function handleAddBookClick() {
        if (saved) {
            removeBook(book);
        } else {
            addBook(book);
        }
    }

    function handleAddQuoteClick() {
        // ensure book is saved to the user's list
        if (!saved) addBook(book);

        // navigate to the quotes page and open the add-quote form for this book
        navigate("/quotes", { state: { book, openAddQuote: true } });
    }

    if (!book) {
        return <div className="book-card">Missing book prop</div>;
    }

    function handleViewQuotes() {
        navigate("/quotes", { state: { book } });
    }

  return (
    <div className="book-card">
      <div className="book-cover">
        {book.url ? (
          <img className="book-image" src={book.url} alt={book.title} />
        ) : (
          <div className="book-cover-placeholder">No cover</div>
        )}

        <div className="book-overlay">
          <button
            className={`add-book-btn ${saved ? "saved" : ""}`}
            onClick={handleAddBookClick}
          >
            {saved ? "Saved" : "Add book to my list"}
          </button>

          <button className="add-quote-btn" onClick={handleAddQuoteClick}>
            Add quote for this book
          </button>
        </div>
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <h2>{book.author}</h2>
      </div>
    </div>
  );
}

export default BookCard;