import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Container, Divider, Grid } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import NavBar from './NavBar'

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
  // run this before the component is rerendered.
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
        console.log('error is', error)
      }
    }
    getAuthentication()
  }, [])

  return (
    <>
      <Container class="p-8">
        <p class="text-5xl font-bold my-4">Welcome to BINGER.</p>
        <p class="text-xl mb-8">
          This is your one-stop shop for all your binge-watching needs. Find the
          content you love.
        </p>
        <Divider />
        <Container class="mt-8">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <p class="text-3xl font-semibold">Top 10 Movies</p>
            </Grid>
            <Grid item xs={6}>
              <p class="text-3xl font-semibold">Top 10 Shows</p>
            </Grid>
          </Grid>
        </Container>
      </Container>
    </>
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
