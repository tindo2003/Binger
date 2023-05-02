import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import MovieCard from './MovieCard'

const config = require('../config.json')

function UserPage() {
  const [userData, setUserData] = useState(null)
  const [favMovie, setFavMovie] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedMovieId, setSelectedMovieID] = useState(null)
  const getUserInfo = async () => {
    try {
      const res = await axios.get(
        `http://${config.server_host}:${config.server_port}/authenticated`,
        {
          headers: {
            authorization: sessionStorage.getItem('app-token'),
          },
        },
      )
      if (res.data.success) {
        setIsAuthenticated(true)
        setUserData(res.data.info)
      } else {
        setIsAuthenticated(false)
        sessionStorage.removeItem('app-token')
        // remove the session token from the session storage
      }
    } catch (error) {
      console.log('error is', error)
    }
  }
  const getFavoriteMovie = async () => {
    try {
      const res = await axios.get(
        `http://${config.server_host}:${config.server_port}/getFavoriteMovies`,
        {
          headers: {
            authorization: sessionStorage.getItem('app-token'),
          },
        },
      )
      console.log(res.data.data)
      setFavMovie(res.data.data)
    } catch (error) {
      console.log('error is', error)
    }
  }
  useEffect(() => {
    async function fetchData() {
      const result1 = await getUserInfo()

      const result2 = await getFavoriteMovie()
    }
    fetchData()
  }, [])

  if (isAuthenticated && favMovie) {
    return (
      <>
        <div className="flex flex-col">
          <div className="mx-auto mt-5 text-2xl font-bold">
            Welcome {userData.first_name} {userData.last_name}
          </div>

          <Container className="mt-5">
            <p className="text-xl font-medium">Your favorite movie is: </p>
            {selectedMovieId && (
              <MovieCard
                showName={selectedMovieId}
                handleClose={() => setSelectedMovieID(null)}
              />
            )}
            {console.log(selectedMovieId)}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell key="Title">Title</TableCell>
                    <TableCell key="Genres">Plays</TableCell>
                    <TableCell key="Language">Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {favMovie.map((myMovie) => (
                    <TableRow key={myMovie.id}>
                      <TableCell key="Title">
                        <Link
                          onClick={() =>
                            setSelectedMovieID(myMovie.original_title)
                          }
                        >
                          {myMovie.original_title}
                        </Link>
                      </TableCell>
                      <TableCell key="Genres">{myMovie.genres}</TableCell>
                      <TableCell key="Language">
                        {myMovie.original_language}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </div>
      </>
    )
  } else {
    return (
      <>
        <p> Your session has expired. Click here to return back to login</p>
        <Link className="text-blue-500 hover:underline focus:underline" to="/">
          Home
        </Link>
      </>
    )
  }
}

export default UserPage
