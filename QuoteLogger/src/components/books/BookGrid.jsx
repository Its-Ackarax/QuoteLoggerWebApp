import { useState, useEffect, useRef } from "react";
import BookCard from "./BookCard";
import "../../styles/books/BookGrid.css";

function BookGrid({ books, limit = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [layoutTick, setLayoutTick] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const wasMobile = isMobile;
      const nowMobile = window.innerWidth <= 640;
      setIsMobile(nowMobile);
      setLayoutTick((tick) => tick + 1);
      
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
    if (!carouselRef.current) return;

    const track = carouselRef.current;
    const viewport = track.parentElement;

    const centerCurrentCard = () => {
      if (!isMobile || !track || !viewport) return;
      const currentCard = track.children[currentIndex];
      if (!currentCard) return;

      const viewportRect = viewport.getBoundingClientRect();
      const viewportStyles = getComputedStyle(viewport);
      const paddingLeft = parseFloat(viewportStyles.paddingLeft) || 0;
      const paddingRight = parseFloat(viewportStyles.paddingRight) || 0;
      const visibleWidth = viewportRect.width - paddingLeft - paddingRight;
      const centerX = viewportRect.left + paddingLeft + visibleWidth / 2;

      const transform = getComputedStyle(track).transform;
      let currentTranslate = 0;
      if (transform && transform !== "none") {
        if (transform.startsWith("matrix3d(")) {
          const values = transform
            .slice(9, -1)
            .split(",")
            .map((value) => parseFloat(value.trim()));
          currentTranslate = values[12] || 0;
        } else if (transform.startsWith("matrix(")) {
          const values = transform
            .slice(7, -1)
            .split(",")
            .map((value) => parseFloat(value.trim()));
          currentTranslate = values[4] || 0;
        }
      }

      const trackRect = track.getBoundingClientRect();
      const trackBaseLeft = trackRect.left - currentTranslate;
      const cardCenterOffset = currentCard.offsetLeft + currentCard.offsetWidth / 2;
      const desiredTranslate = centerX - (trackBaseLeft + cardCenterOffset);

      track.style.transform = `translateX(${desiredTranslate}px)`;
    };

    if (isMobile) {
      centerCurrentCard();
      const rafId = requestAnimationFrame(centerCurrentCard);

      const observer = viewport
        ? new ResizeObserver(() => {
            centerCurrentCard();
          })
        : null;
      if (observer && viewport) {
        observer.observe(viewport);
      }

      return () => {
        cancelAnimationFrame(rafId);
        if (observer) observer.disconnect();
      };
    }

    // Reset transform when not in mobile mode
    track.style.transform = "";
  }, [currentIndex, isMobile, layoutTick]);

  return (
    <div className="book-grid-container">
      <div className="book-grid-frame" aria-hidden="true" />
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