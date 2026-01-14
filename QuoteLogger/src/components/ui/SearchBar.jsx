import { useState, useEffect } from "react";
import searchIcon from "../../assets/search-svgrepo-com.svg";
import "../../styles/SearchBar.css";

function SearchInput({ value, onChange, onSubmit }) {
  const [placeholder, setPlaceholder] = useState("Type the name of an author or book");

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

  return (
    <form className="search-input" onSubmit={onSubmit}>
      <div className="search-input-wrapper">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input
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