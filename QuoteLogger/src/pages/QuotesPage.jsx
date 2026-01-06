import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuotes } from "../context/QuotesContext";
import { useBooks } from "../context/BooksContext";
import "../styles/QuotesPage.css";

function QuotesPage() {
  const { quotes, addQuote, getBookKey } = useQuotes();
  const { books } = useBooks();
  const location = useLocation();

  // Build a list of book keys that includes saved books (even if they have no quotes)
  const savedKeys = books.map((b) => getBookKey(b));
  const quoteKeys = Object.keys(quotes);

  // Ensure any book passed through location state is included (e.g., just-saved book when navigating)
  const locationBookKey = location?.state?.book ? getBookKey(location.state.book) : null;

  // Keep saved books first, then any other books that only have quotes; ensure locationBookKey is present
  const keySet = new Set(savedKeys);
  if (locationBookKey) keySet.add(locationBookKey);
  for (const k of quoteKeys) {
    if (!keySet.has(k)) keySet.add(k);
  }
  const bookKeys = Array.from(keySet).sort((k1, k2) => {
    const t1 = (k1.split("|")[0] || "").toString();
    const t2 = (k2.split("|")[0] || "").toString();
    return t1.localeCompare(t2, undefined, { sensitivity: "base" });
  });

  const [selectedBookKey, setSelectedBookKey] = useState(
    bookKeys[0] || null
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [formText, setFormText] = useState("");
  const [formPage, setFormPage] = useState("");
  const [formReflection, setFormReflection] = useState("");

  const navigate = useNavigate();

  // open add form if navigated from a book card (consume openAddQuote so it doesn't persist)
  useEffect(() => {
    if (location?.state?.book) {
      const key = getBookKey(location.state.book);
      setSelectedBookKey(key);

      if (location.state.openAddQuote) {
        setShowAddForm(true);
        // remove the flag from history state so it doesn't re-trigger on refresh/back
        navigate(location.pathname, { replace: true, state: { book: location.state.book } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state]);

  useEffect(() => {
    if (!selectedBookKey && bookKeys.length) {
      setSelectedBookKey(bookKeys[0]);
    }
  }, [bookKeys, selectedBookKey]);

  const selectedQuotes = selectedBookKey ? quotes[selectedBookKey] || [] : [];

  const [title, author] = selectedBookKey ? selectedBookKey.split("|") : [];

  function handleSubmit(e) {
    e.preventDefault();
    if (!formText || !selectedBookKey) return;

    const [t, a] = selectedBookKey.split("|");

    // sanitize page number: convert to number or leave undefined
    const pageNum = formPage ? Number(formPage) : undefined;
    const page = pageNum && Number.isFinite(pageNum) ? pageNum : undefined;

    addQuote({ title: t, author: a }, { text: formText, page, reflection: formReflection });

    setFormText("");
    setFormPage("");
    setFormReflection("");
    setShowAddForm(false);
  }

  return (
    <div className="quotes-layout">
      {/* LEFT SIDEBAR */}
      <aside className="quotes-sidebar">
        <h2>Books</h2>

        {books.length === 0 ? (
          <p>No books added yet</p>
        ) : (
          bookKeys.length === 0 && <p>No quotes yet</p>
        )}

        <ul>
          {bookKeys.map((key) => {
            const [t, a] = key.split("|");

            return (
              <li
                key={key}
                className={key === selectedBookKey ? "active" : ""}
                onClick={() => setSelectedBookKey(key)}
              >
                <div className="book-list-line">
                  <strong>{t}</strong>
                  <span className="book-quote-count">{(quotes[key] || []).length}</span>
                </div>
                <span>{a}</span>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* RIGHT PANEL */}
      <main className="quotes-panel">
        {books.length === 0 ? (
          <p>You must first add books to add quotes</p>
        ) : selectedBookKey ? (
          <>
            <div className="quotes-panel-header">
              <div className="title-col">
                <h1>{title}</h1>
                <div className="author-row">
                  <h3 className="author-name">{author}</h3>
                  <button onClick={() => setShowAddForm((s) => !s)} className="add-quote-inline">{showAddForm ? 'Cancel' : 'Add Quote'}</button>
                </div>
              </div>
            </div>

            {showAddForm && (
              <form className="quote-form" onSubmit={handleSubmit}>
                <label>
                  Quote text
                  <textarea value={formText} onChange={(e) => setFormText(e.target.value)} required />
                </label>

                <label>
                  Page (optional)
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formPage}
                    onKeyDown={(e) => {
                      // Allow control/navigation keys and modifier combos
                      const controlKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Tab'];
                      if (e.ctrlKey || e.metaKey) return; // allow copy/paste shortcuts etc.
                      if (controlKeys.includes(e.key)) return;

                      // Block e/E, +, -, . explicitly
                      if (/[eE\+\-\.]/.test(e.key)) {
                        e.preventDefault();
                        return;
                      }

                      // Prevent any single character input that's not a digit
                      if (e.key.length === 1 && !/\d/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      const text = (e.clipboardData || window.clipboardData).getData('text');
                      if (!/^\d+$/.test(text)) e.preventDefault();
                    }}
                    onChange={(e) => setFormPage(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="e.g. 123"
                    aria-label="page number"
                  />
                </label>

                <label>
                  Reflection (optional)
                  <textarea value={formReflection} onChange={(e) => setFormReflection(e.target.value)} />
                </label>

                <div className="quote-form-actions">
                  <button type="submit" className="primary">Save Quote</button>
                </div>
              </form>
            )}

            <div className="quotes-list">
              {selectedQuotes.map((quote) => (
                <div key={quote.id} className="quote-card">
                  <blockquote>“{quote.text}”</blockquote>

                  {quote.page && (
                    <span className="quote-page">
                      Page {quote.page}
                    </span>
                  )}

                  {quote.reflection && (
                    <p className="quote-reflection">
                      {quote.reflection}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Select a book to view quotes</p>
        )}
      </main>
    </div>
  );
}

export default QuotesPage;