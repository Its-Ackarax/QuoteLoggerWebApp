import "../../styles/BookCard.css"

function BookCard({book}) {
    console.log("BookCard book prop:", book);

    if (!book) {
        return (
            <div className="book-card" style={{ border: "2px solid red", padding: 12 }}>
                Missing book prop
            </div>
        );
    }

    function onFavoriteClick(){
        alert("clicked")
    }
    return(
        <div className="book-card">
            <div className="book-cover">
                {book.url ? (
                    <img className="book-image" src={book.url} alt={book.title} loading="lazy" />
                ) : (
                    <div className="book-cover-placeholder">No cover</div>
                )}

                <div className="book-overlay">
                    <button className ="favorite-btn" onClick={onFavoriteClick}>
                        +
                    </button>
                </div>

            </div>
            <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <h2 className="book-author">{book.author}</h2>
            </div>
        </div>
    )
}

export default BookCard