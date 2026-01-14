import { useEffect } from "react";
import { useBooks } from "../context/BooksContext";
import BookGrid from "../components/books/BookGrid";
import "../styles/pages/BooksPage.css";

function BooksPage() {
  const { books } = useBooks();

  useEffect(() => {
    const updateScrollLock = () => {
      if (window.innerWidth <= 640) {
        document.body.classList.add("books-page-no-scroll");
      } else {
        document.body.classList.remove("books-page-no-scroll");
      }
    };

    updateScrollLock();
    window.addEventListener("resize", updateScrollLock);
    return () => {
      window.removeEventListener("resize", updateScrollLock);
      document.body.classList.remove("books-page-no-scroll");
    };
  }, []);

  return (
    <div className="books-page">
      <div className="books-page-header">
        <div className="header-content">
          <h1>My Books</h1>
          <div className="books-count-badge">
            <span className="count-number">{books.length}</span>
            <span className="count-label">
              {books.length === 1 ? "Book" : "Books"}
            </span>
          </div>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <p className="empty-state-title">No books saved yet</p>
            <p className="empty-state-message">
              Start building your collection by searching for books on the home page.
            </p>
          </div>
        </div>
      ) : (
        <BookGrid books={books} />
      )}
    </div>
  );
}

export default BooksPage;