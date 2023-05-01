import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

const config = require('../config.json')

// use this whenever you want the route protected?

function HomePage() {
  const setHeaders = () => {
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem(
      'app-token',
    )
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getAuthentication = async () => {
      try {
        const res = await axios.get(
          `http://${config.server_host}:${config.server_port}/authenticated`,
          {
            headers: {
              authorization: sessionStorage.getItem('app-token'),
            },
          },
        )
        console.log('res is', res)
        if (res.data.success) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          sessionStorage.removeItem('app-token')
          // remove the session token from the session storage
        }
      } catch (error) {
        console.log("error is", error)
      }
    }
    getAuthentication()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <h1>Welcome to Binger.</h1>
        <h3>This is your one-stop shop for all your binge-watching needs. Find the content you love.</h3>
      </Container>
      <Divider />
      
    </ThemeProvider>
    
  )

  // if (isAuthenticated) {
  //   return <div>Welcome </div>
  // } else {
  //   return (
  //     <>
  //       <p> Your session has expired. Click here to return back to login</p>
  //       {
  //         <Link
  //           className="text-blue-500 hover:underline focus:underline"
  //           to="/"
  //         >
  //           Home
  //         </Link>
  //       }{' '}
  //     </>
  //   )
  // }
}

export default HomePage
