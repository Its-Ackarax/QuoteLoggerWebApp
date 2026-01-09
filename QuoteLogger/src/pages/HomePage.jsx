import { useEffect, useState } from "react";
import SearchBar from "../components/ui/SearchBar";
import BookGrid from "../components/books/BookGrid";
import { searchBooks, getPopularBooks } from "../services/booksApi";
import "../styles/HomePage.css";

function HomePage() {
  const [query, setQuery] = useState("");
  const [popularBooks, setPopularBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPopularBooks() {
      setLoading(true);
      const books = await getPopularBooks();
      setPopularBooks(books);
      setLoading(false);
    }

    loadPopularBooks();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    const results = await searchBooks(query);
    setSearchResults(results);
    setHasSearched(true);
    setLoading(false);

    

  }


  
  return (
    <div className="home">
      <section className="home-search-area">
        <h1>
          Search and add books<br />
          to log your quotes
        </h1>

        <SearchBar
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") {
              setHasSearched(false);
            }
          }}
          onSubmit={handleSearch}
        />
      </section>

      <section className="home-popular">
        <h2>{hasSearched ? "Search Results:" : "Popular Books:"}</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <BookGrid books={hasSearched ? searchResults : popularBooks} />
        )}
      </section>
    </div>
  );
}

export default HomePage;