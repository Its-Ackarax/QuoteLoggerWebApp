import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import QuotesPage from "./pages/QuotesPage";
import { BooksProvider } from "./context/BooksContext";
import { QuotesProvider } from "./context/QuotesContext";
import { ThemeProvider } from "./context/ThemeContext";
import './styles/variables.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
    <BooksProvider>
      <QuotesProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<App/>}>
              <Route path="/" element={<HomePage/>} />
              <Route path="/books" element={<BooksPage/>} />
              <Route path="/quotes" element={<QuotesPage/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QuotesProvider>
    </BooksProvider>
    </ThemeProvider>
  </StrictMode>
)
