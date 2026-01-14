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
  const { quotes, addQuote, getBookKey, removeQuote, updateQuote } = useQuotes();
  const { books } = useBooks();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const openingFromNavigation = useRef(false);
  const lastLocationKeyRef = useRef(null);

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
    if (lastLocationKeyRef.current === location.key) return;
    lastLocationKeyRef.current = location.key;

    if (location?.state?.book) {
      const key = getBookKey(location.state.book);

      if (location.state.openAddQuote) {
        openingFromNavigation.current = true;
        setSelectedBookKey(key);
        setShowAddForm(true);
        navigate(location.pathname, {
          replace: true,
          state: { book: location.state.book },
        });
        setTimeout(() => {
          openingFromNavigation.current = false;
        }, 100);
      } else {
        setSelectedBookKey(key);
      }
    }
  }, [location.key, location?.state, getBookKey, navigate, location.pathname]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (openingFromNavigation.current) {
      return;
    }
    
    setShowAddForm(false);
  }, [selectedBookKey]);

  useEffect(() => {
    let scrollY = 0;
    const updateScrollLock = () => {
      const isMobile = window.innerWidth <= 640;
      if (sidebarOpen && isMobile) {
        scrollY = window.scrollY || window.pageYOffset || 0;
        document.body.classList.add("quotes-sidebar-open");
        document.body.style.top = `-${scrollY}px`;
        document.documentElement.classList.add("quotes-sidebar-open");
      } else {
        document.body.classList.remove("quotes-sidebar-open");
        document.body.style.top = "";
        document.documentElement.classList.remove("quotes-sidebar-open");
        if (scrollY) {
          window.scrollTo(0, scrollY);
        }
      }
    };

    updateScrollLock();
    window.addEventListener("resize", updateScrollLock);
    return () => {
      window.removeEventListener("resize", updateScrollLock);
      document.body.classList.remove("quotes-sidebar-open");
      document.body.style.top = "";
      document.documentElement.classList.remove("quotes-sidebar-open");
      if (scrollY) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [sidebarOpen]);

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

  function handleUpdateQuote(quoteId, quoteData) {
    if (!selectedBookKey) return;
    updateQuote({ title, author }, quoteId, quoteData);
  }

  const handleSelectBook = (key) => {
    setSelectedBookKey(key);
    setSidebarOpen(false); // Close sidebar on mobile when book is selected
  };

  return (
    <div className={`quotes-layout ${sidebarOpen ? "sidebar-active" : ""}`}>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <QuotesSidebar
        bookKeys={bookKeys}
        quotes={quotes}
        selectedBookKey={selectedBookKey}
        setSelectedBookKey={handleSelectBook}
        books={books}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="quotes-panel">
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle books list"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Books</span>
        </button>
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
              onUpdate={handleUpdateQuote}
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
