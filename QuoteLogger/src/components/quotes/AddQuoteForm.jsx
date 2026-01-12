import { useState } from "react";
import "../../styles/quotes/AddQuoteForm.css";

function AddQuoteForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [page, setPage] = useState("");
  const [reflection, setReflection] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const pageNum = page ? Number(page) : undefined;

    onSubmit({
      text: text.trim(),
      page: Number.isFinite(pageNum) ? pageNum : undefined,
      reflection: reflection.trim() || undefined,
    });

    setText("");
    setPage("");
    setReflection("");
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
        <button type="submit" className="primary">Save Quote</button>
      </div>
    </form>
  );
}

export default AddQuoteForm;
