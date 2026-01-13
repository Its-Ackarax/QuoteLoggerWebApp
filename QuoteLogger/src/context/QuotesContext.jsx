import { createContext, useContext, useEffect, useState } from "react";

const QuotesContext = createContext();

export function QuotesProvider({ children }) {
  const [quotes, setQuotes] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bookQuotes");
    if (stored) {
      const parsed = JSON.parse(stored);
      const cleaned = {};
      Object.keys(parsed).forEach((key) => {
        if (parsed[key] && parsed[key].length > 0) {
          cleaned[key] = parsed[key];
        }
      });
      setQuotes(cleaned);
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

    setQuotes((prev) => {
      const updatedQuotes = (prev[key] || []).filter((q) => q.id !== quoteId);
      const updated = { ...prev };
      
      if (updatedQuotes.length === 0) {
        delete updated[key];
      } else {
        updated[key] = updatedQuotes;
      }
      
      return updated;
    });
  }

  function removeAllQuotesForBook(book) {
    const key = getBookKey(book);
    setQuotes((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }

  function updateQuote(book, quoteId, updatedQuote) {
    const key = getBookKey(book);
    setQuotes((prev) => {
      if (!prev[key]) return prev;
      const quotesArray = prev[key] || [];
      const quoteToUpdate = quotesArray.find(q => q.id === quoteId);
      
      if (!quoteToUpdate) return prev;
      
      const textChanged = quoteToUpdate.text !== updatedQuote.text;
      const pageChanged = quoteToUpdate.page !== updatedQuote.page;
      const reflectionChanged = (quoteToUpdate.reflection || undefined) !== (updatedQuote.reflection || undefined);
      
      if (!textChanged && !pageChanged && !reflectionChanged) {
        return prev;
      }
      
      const updatedQuotes = quotesArray.map((q) => {
        if (q.id === quoteId) {
          return {
            ...q,
            text: updatedQuote.text,
            page: updatedQuote.page,
            reflection: updatedQuote.reflection || undefined
          };
        }
        return q;
      });
      return {
        ...prev,
        [key]: updatedQuotes
      };
    });
  }

  return (
    <QuotesContext.Provider
      value={{ quotes, addQuote, removeQuote, removeAllQuotesForBook, updateQuote, getBookKey }}
    >
      {children}
    </QuotesContext.Provider>
  );
}
export function useQuotes() {
  return useContext(QuotesContext);
}