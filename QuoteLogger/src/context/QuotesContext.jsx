import { createContext, useContext, useEffect, useState } from "react";

const QuotesContext = createContext();

export function QuotesProvider({ children }) {
  const [quotes, setQuotes] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bookQuotes");
    if (stored) {
      setQuotes(JSON.parse(stored));
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem("bookQuotes", JSON.stringify(quotes));
  }, [quotes, hasLoaded]);

  function getBookKey(book) {
    return `${book.title}|${book.author}`;
  }

    function addQuote(book, quote) {
    const key = getBookKey(book);

    setQuotes((prev) => ({
        ...prev,
        [key]: [
        ...(prev[key] || []),
        {
            id: Date.now(),
            text: quote.text,
            page: quote.page,
            reflection: quote.reflection
        }
        ]
    }));
}



  function removeQuote(book, quoteId) {
    const key = getBookKey(book);

    setQuotes((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((q) => q.id !== quoteId)
    }));
  }

  function removeAllQuotesForBook(book) {
    const key = getBookKey(book);
    setQuotes((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }

  return (
    <QuotesContext.Provider
      value={{ quotes, addQuote, removeQuote, removeAllQuotesForBook, getBookKey }}
    >
      {children}
    </QuotesContext.Provider>
  );
}



export function useQuotes() {
  return useContext(QuotesContext);
}