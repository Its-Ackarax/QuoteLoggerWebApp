import { createContext, useContext, useEffect, useState } from "react";

const BooksContext = createContext();

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // ✅ Load from localStorage ONCE
  useEffect(() => {
    const storedBooks = localStorage.getItem("savedBooks");
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
    setHasLoaded(true);
  }, []);

  // ✅ Save only AFTER initial load
  useEffect(() => {
    if (!hasLoaded) return;
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