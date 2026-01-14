import "../../styles/books/BookCard.css";
import { useBooks } from "../../context/BooksContext";
import { useQuotes } from "../../context/QuotesContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import DeleteBookModal from "./DeleteBookModal";

function BookCard({ book, isCenter = false }) {

    const { addBook, removeBook, isBookSaved } = useBooks();
    const { quotes, getBookKey, removeAllQuotesForBook } = useQuotes();
    const saved = isBookSaved(book);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const overlayEnabledRef = useRef(false);
    const enableTimeoutRef = useRef(null);

    const bookKey = getBookKey(book);
    const quoteCount = quotes[bookKey]?.length || 0;
    const isHomePage = location.pathname === "/";


    function handleConfirmDelete() {
        removeAllQuotesForBook(book);
        removeBook(book);
        setShowDeleteModal(false);
    }

    function handleCancelDelete() {
        setShowDeleteModal(false);
    }

    function handleAddQuoteClick() {
        if (!overlayEnabledRef.current) return;
        if (!saved) addBook(book);
        navigate("/quotes", { state: { book, openAddQuote: true } });
    }

    function handleAddBookClick() {
        if (!overlayEnabledRef.current) return;
        if (saved) {
            if (quoteCount > 0) {
                setShowDeleteModal(true);
            } else {
                removeBook(book);
            }
        } else {
            addBook(book);
        }
    }

    function handleMouseEnter() {
        clearTimeout(enableTimeoutRef.current);
        enableTimeoutRef.current = setTimeout(() => {
            overlayEnabledRef.current = true;
        }, 200); // Enable after 200ms delay
    }

    function handleMouseLeave() {
        clearTimeout(enableTimeoutRef.current);
        overlayEnabledRef.current = false;
    }

    if (!book) {
        return <div className="book-card">Missing book prop</div>;
    }

    function handleViewQuotes() {
        navigate("/quotes", { state: { book } });
    }

  return (
    <>
      <div 
        className={`book-card ${isCenter ? "book-card-center" : "book-card-side"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {saved && isHomePage && (
          <div className="saved-indicator" title="Added to your list">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8L6 11L13 4" stroke="#0a7b3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
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
              {saved ? "Remove from favourites" : "Add Book To List"}
            </button>

            <button className="add-quote-btn" onClick={handleAddQuoteClick}>
              Add Quote
            </button>
          </div>
        </div>

        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <h2 className="book-author">by {book.author}</h2>
        </div>
      </div>

      <DeleteBookModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        bookTitle={book.title}
        quoteCount={quoteCount}
      />
    </>
  );
}

export default BookCard;