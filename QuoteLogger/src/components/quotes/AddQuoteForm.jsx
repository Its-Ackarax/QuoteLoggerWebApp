import { useState, useEffect } from "react";
import "../../styles/quotes/AddQuoteForm.css";

function AddQuoteForm({ onSubmit, initialText = "", initialPage = "", initialReflection = "", onCancel }) {
  const [text, setText] = useState(initialText);
  const [page, setPage] = useState(initialPage ? String(initialPage) : "");
  const [reflection, setReflection] = useState(initialReflection || "");

  useEffect(() => {
    setText(initialText);
    setPage(initialPage ? String(initialPage) : "");
    setReflection(initialReflection || "");
  }, [initialText, initialPage, initialReflection]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const pageNum = page ? Number(page) : undefined;

    onSubmit({
      text: text.trim(),
      page: Number.isFinite(pageNum) ? pageNum : undefined,
      reflection: reflection.trim() || undefined,
    });

    if (!initialText) {
      setText("");
      setPage("");
      setReflection("");
    }
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <label>
        Quote text
        <textarea
          style={{resize: "none"}}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </label>

      <label>
        Page (optional)
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={page}
          onChange={(e) => setPage(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="e.g. 123"
        />
      </label>

      <label>
        Reflection (optional)
        <textarea
          style={{resize: "none"}}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
      </label>

      <div className="quote-form-actions">
        {onCancel && (
          <button type="button" className="cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="primary">
          {initialText ? "Update Quote" : "Save Quote"}
        </button>
      </div>
    </form>
  );
}

export default AddQuoteForm;
