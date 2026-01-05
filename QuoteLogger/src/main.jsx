import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import QuotesPage from "./pages/QuotesPage";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App/>}>
          <Route path="/" element={<HomePage/>} />
          <Route path="/books" element={<BooksPage/>} />
          <Route path="/quotes" element={<QuotesPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
