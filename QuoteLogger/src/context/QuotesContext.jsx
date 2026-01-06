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
      [key]: prev[key].filter((q) => q.id !== quoteId)
    }));
  }

  return (
    <QuotesContext.Provider
      value={{ quotes, addQuote, removeQuote, getBookKey }}
    >
      {children}
    </QuotesContext.Provider>
  );
}



export function useQuotes() {
  return useContext(QuotesContext);
}