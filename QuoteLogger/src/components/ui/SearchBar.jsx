
import "../../styles/SearchBar.css";

function SearchInput({ value, onChange, onSubmit }) {
  return (
    <form className="search-input" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Type the name of an author or book"
        value={value}
        onChange={onChange}
      />
    </form>
  );
}

export default SearchInput;