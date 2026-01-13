import searchIcon from "../../assets/search-svgrepo-com.svg";
import "../../styles/SearchBar.css";

function SearchInput({ value, onChange, onSubmit }) {
  return (
    <form className="search-input" onSubmit={onSubmit}>
      <div className="search-input-wrapper">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search books or authors"
          value={value}
          onChange={onChange}
        />
      </div>
    </form>
  );
}

export default SearchInput;