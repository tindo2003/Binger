import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginComponent from './components/LoginComponent'
import SignUP from './components/Signup'
import HomePage from './components/HomePage'
import SearchPage from './components/SearchPage'
import MovieFinal from './components/MovieFinal'
import UserPage from './components/UserPage'

function App() {
  return (
    <Router>
      <div>
        <section>
          <article>
            <Routes>
              <Route path="/" element={<LoginComponent />} />
              <Route path="/register" element={<SignUP />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/moviefinal" element={<MovieFinal />} />
              <Route path="/mypage" element={<UserPage />} />
            </Routes>
          </article>
        </section>
      </div>
    </Router>
  )
}

export default App
