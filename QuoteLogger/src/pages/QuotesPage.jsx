import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuotes } from "../context/QuotesContext";
import { useBooks } from "../context/BooksContext";

import QuotesSidebar from "../components/quotes/QuotesSidebar";
import QuotesList from "../components/quotes/QuotesList";
import AddQuoteForm from "../components/quotes/AddQuoteForm";
import DeleteQuoteModal from "../components/quotes/DeleteQuoteModal";

import "../styles/pages/QuotesPage.css";

function QuotesPage() {
  const { quotes, addQuote, getBookKey, removeQuote } = useQuotes();
  const { books } = useBooks();
  const location = useLocation();
  const navigate = useNavigate();

  const savedKeys = books.map(getBookKey);
  const quoteKeys = Object.keys(quotes);

  const locationBookKey = location?.state?.book
    ? getBookKey(location.state.book)
    : null;

  const keySet = new Set(savedKeys);
  if (locationBookKey) keySet.add(locationBookKey);
  quoteKeys.forEach((k) => keySet.add(k));

  const bookKeys = Array.from(keySet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const [selectedBookKey, setSelectedBookKey] = useState(bookKeys[0] || null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!bookKeys.length) {
      setSelectedBookKey(null);
      return;
    }

    if (!selectedBookKey) {
      setSelectedBookKey(bookKeys[0]);
      return;
    }

    if (bookKeys.includes(selectedBookKey)) return;
    setSelectedBookKey(bookKeys[0]);
  }, [bookKeys, selectedBookKey]);

  useEffect(() => {
    if (location?.state?.book) {
      const key = getBookKey(location.state.book);
      setSelectedBookKey(key);

      if (location.state.openAddQuote) {
        setShowAddForm(true);
        navigate(location.pathname, {
          replace: true,
          state: { book: location.state.book },
        });
      }
    }
  }, [location?.state, getBookKey, navigate, location.pathname]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setShowAddForm(false);
  }, [selectedBookKey]);

  const selectedQuotes = selectedBookKey
    ? [...(quotes[selectedBookKey] || [])].sort((a, b) => {
        if (!a.page && !b.page) return 0;
        if (!a.page) return 1;
        if (!b.page) return -1;
        return a.page - b.page;
      })
    : [];

  const [title, author] = selectedBookKey
    ? selectedBookKey.split("|")
    : [];

  function handleAddQuote(quoteData) {
    if (!selectedBookKey) return;
    addQuote({ title, author }, quoteData);
    setShowAddForm(false);
  }

  function handleDeleteQuote(id) {
    if (!selectedBookKey) return;
    setQuoteToDelete(id);
  }

  function handleConfirmDelete() {
    if (!selectedBookKey || !quoteToDelete) return;
    removeQuote({ title, author }, quoteToDelete);
    setQuoteToDelete(null);
  }

  function handleCancelDelete() {
    setQuoteToDelete(null);
  }

  return (
    <div className="quotes-layout">
      <QuotesSidebar
        bookKeys={bookKeys}
        quotes={quotes}
        selectedBookKey={selectedBookKey}
        setSelectedBookKey={setSelectedBookKey}
        books={books}
      />

      <main className="quotes-panel">
        {!books.length ? (
          <p>You must first add books to add quotes</p>
        ) : (
          <>
            <div className="quotes-panel-header">
              <div className="title-col">
                <h1>{title}</h1>
                <div className="author-row">
                  <h3 className="author-name">by {author}</h3>
                  <button
                    className={`add-quote-inline ${showAddForm ? "cancel-btn" : ""}`}
                    onClick={() => setShowAddForm((s) => !s)}
                  >
                    {showAddForm ? "Cancel" : "Add Quote"}
                  </button>
                </div>
              </div>
            </div>

            {showAddForm && (
              <AddQuoteForm
                onSubmit={handleAddQuote}
              />
            )}

            <QuotesList
              quotes={selectedQuotes}
              onDelete={handleDeleteQuote}
              isAdding={showAddForm}
            />
          </>
        )}
      </main>

      <DeleteQuoteModal
        isOpen={quoteToDelete !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default QuotesPage;
