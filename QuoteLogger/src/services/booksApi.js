export async function searchBooks(query) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  if (!data.items) return [];

  return data.items.map((item) => {
    const info = item.volumeInfo;

    return {
      title: info.title ?? "Untitled",
      author: info.authors ? info.authors.join(", ") : "Unknown Author",
      url: info.imageLinks?.thumbnail ?? null
    };
  });
}

export async function getPopularBooks() {
  const apiKey = "AY0COmY1NlPN5lQUP0Z94c4TOiIOAugD9t58wAaLhTaqzYkh"; 
  const listName = "combined-print-and-e-book-fiction"; // You can change this to other NYT best seller lists

  const response = await fetch(
    `https://api.nytimes.com/svc/books/v3/lists/current/${listName}.json?api-key=${apiKey}`
  );

  const data = await response.json();

  // If the API did not return results or the expected structure, return empty
  if (!data?.results?.books) return [];

  return data.results.books.map((book) => {
    return {
      title: book.title ?? "Untitled",
      author: book.author ?? "Unknown Author",
      // NYT best seller results include a book_cover image already
      url: book.book_image ?? null,
      // You can also optionally return rank or description if you need
      rank: book.rank,
      description: book.description
    };
  });
}