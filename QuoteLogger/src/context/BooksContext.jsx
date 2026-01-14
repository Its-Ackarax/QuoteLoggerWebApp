import { createContext, useContext, useEffect, useState, useRef } from "react";

const BooksContext = createContext();

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const storedBooks = localStorage.getItem("savedBooks");
    if (storedBooks) {
      try {
        setBooks(JSON.parse(storedBooks));
      } catch (error) {
        console.error("Error parsing saved books:", error);
        setBooks([]);
      }
    }
    setHasLoaded(true);
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (!hasLoaded || isInitialMount.current) return;
    localStorage.setItem("savedBooks", JSON.stringify(books));
  }, [books, hasLoaded]);

  function getBookIdentity(book) {
    return book.bookId ?? `${book.title}|${book.author}|${book.url ?? ""}`;
  }

  function addBook(book) {
    setBooks((prev) => {
      const exists = prev.some(
        (b) => getBookIdentity(b) === getBookIdentity(book)
      );
      return exists ? prev : [...prev, book];
    });
  }

  function removeBook(book) {
    setBooks((prev) =>
      prev.filter(
        (b) => getBookIdentity(b) !== getBookIdentity(book)
      )
    );
  }

  function isBookSaved(book) {
    return books.some(
      (b) => getBookIdentity(b) === getBookIdentity(book)
    );
  }

  return (
    <BooksContext.Provider
      value={{ books, addBook, removeBook, isBookSaved }}
    >
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  return useContext(BooksContext);
}