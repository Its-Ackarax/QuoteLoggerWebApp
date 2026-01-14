import { useState, useEffect, useRef } from "react";
import searchIcon from "../../assets/search-svgrepo-com.svg";
import "../../styles/SearchBar.css";

function SearchInput({ value, onChange, onSubmit }) {
  const [placeholder, setPlaceholder] = useState("Type the name of an author or book");
  const inputRef = useRef(null);

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth <= 640) {
        setPlaceholder("Search books/authors");
      } else {
        setPlaceholder("Type the name of an author or book");
      }
    };

    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

  const handleSubmit = (event) => {
    if (onSubmit) onSubmit(event);
    inputRef.current?.blur();
  };

  const handleWrapperClick = (event) => {
    if (event.target === event.currentTarget) {
      inputRef.current?.blur();
    }
  };

  return (
    <form className="search-input" onSubmit={handleSubmit}>
      <div className="search-input-wrapper" onClick={handleWrapperClick}>
        <button className="search-icon-button" type="submit" aria-label="Search">
          <img src={searchIcon} alt="" className="search-icon" />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </form>
  );
}

export default SearchInput;