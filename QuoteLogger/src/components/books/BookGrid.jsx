import { useState, useEffect, useRef } from "react";
import BookCard from "./BookCard";
import "../../styles/books/BookGrid.css";

function BookGrid({ books, limit = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const wasMobile = isMobile;
      const nowMobile = window.innerWidth <= 640;
      setIsMobile(nowMobile);
      
      // Reset carousel position when switching between mobile and desktop
      if (wasMobile !== nowMobile && carouselRef.current) {
        carouselRef.current.style.transform = '';
        setCurrentIndex(0);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);

  if (!books || !books.length) {
    return <p>No books found.</p>;
  }

  let displayBooks = [...books].sort((a, b) => {
    const t1 = (a.title || "").toString();
    const t2 = (b.title || "").toString();
    return t1.localeCompare(t2, undefined, { sensitivity: "base" });
  });

  if (limit !== null && limit > 0) {
    displayBooks = displayBooks.slice(0, limit);
  }

  const maxIndex = displayBooks.length - 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return maxIndex; // Wrap to end
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0; // Wrap to beginning
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    if (carouselRef.current && isMobile) {
      const container = carouselRef.current;
      const firstCard = container.querySelector('.book-card');
      if (firstCard) {
        // Get the actual rendered card width
        const cardWidth = firstCard.offsetWidth;
        const gap = 14;
        // Calculate the center position of the container (accounting for padding)
        const containerWidth = container.offsetWidth;
        const padding = 16; // 1rem padding on each side
        const visibleWidth = containerWidth - (padding * 2);
        const centerPosition = visibleWidth / 2 + padding;
        // Calculate where the current card should be positioned to be centered
        // Position the card so its center aligns with the container center
        const cardStartPosition = currentIndex * (cardWidth + gap);
        const cardCenterOffset = cardWidth / 2;
        // Move the carousel so the current card is centered
        const translateX = centerPosition - cardStartPosition - cardCenterOffset;
        container.style.transform = `translateX(${translateX}px)`;
      }
    } else if (carouselRef.current && !isMobile) {
      // Reset transform when not in mobile mode
      carouselRef.current.style.transform = '';
    }
  }, [currentIndex, isMobile]);

  return (
    <div className="book-grid-container">
      {isMobile && displayBooks.length > 1 && (
        <button
          className="carousel-btn carousel-btn-prev"
          onClick={handlePrev}
          aria-label="Previous books"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <div className={`book-grid ${isMobile ? "book-grid-carousel" : ""}`} ref={carouselRef}>
        {displayBooks.map((book, index) => (
          <BookCard 
            key={index} 
            book={book} 
            isCenter={isMobile && index === currentIndex}
          />
        ))}
      </div>
      {isMobile && displayBooks.length > 1 && (
        <button
          className="carousel-btn carousel-btn-next"
          onClick={handleNext}
          aria-label="Next books"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}

export default BookGrid;