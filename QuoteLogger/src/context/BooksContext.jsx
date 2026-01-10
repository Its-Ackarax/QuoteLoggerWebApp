import { createContext, useContext, useEffect, useState, useRef } from "react";

const BooksContext = createContext();

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isInitialMount = useRef(true);

  // ✅ Load from localStorage ONCE
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

  // ✅ Save only AFTER initial load completes AND books actually change
  useEffect(() => {
    if (!hasLoaded || isInitialMount.current) return;
    localStorage.setItem("savedBooks", JSON.stringify(books));
  }, [books, hasLoaded]);

  function addBook(book) {
    setBooks((prev) => {
      const exists = prev.some(
        (b) => b.title === book.title && b.author === book.author
      );
      return exists ? prev : [...prev, book];
    });
  }

  function removeBook(book) {
    setBooks((prev) =>
      prev.filter(
        (b) => !(b.title === book.title && b.author === book.author)
      )
    );
  }

  function isBookSaved(book) {
    return books.some(
      (b) => b.title === book.title && b.author === book.author
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