import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginComponent from './components/LoginComponent'
import SignUP from './components/Signup'
import HomePage from './components/HomePage'
import SearchPage from './components/SearchPage'
import UserPage from './components/UserPage'
import NavBar from './components/NavBar'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/register" element={<SignUP />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mypage" element={<UserPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
