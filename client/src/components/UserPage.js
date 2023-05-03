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
  Divider,
} from '@mui/material'
import MovieCard from './MovieCard'
import ShowCard from './ShowCard'

const config = require('../config.json')

function UserPage() {
  const [userData, setUserData] = useState(null)
  const [favMovie, setFavMovie] = useState(null)
  const [favShow, setFavShow] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedMovieId, setSelectedMovieID] = useState(null)
  const [selectedShowTitle, setSelectedShowTitle] = useState(null)
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

  const handleLogout = () => {
    // detele the JWT
    sessionStorage.removeItem('app-token')
    // relaunch the app
    window.location.reload(true)
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
  const getFavoriteShow = async () => {
    try {
      const res = await axios.get(
        `http://${config.server_host}:${config.server_port}/getFavoriteShows`,
        {
          headers: {
            authorization: sessionStorage.getItem('app-token'),
          },
        },
      )
      console.log('my shows are', res.data)
      setFavShow(res.data)
    } catch (error) {
      console.log('error is', error)
    }
  }
  useEffect(() => {
    async function fetchData() {
      const result1 = await getUserInfo()

      const intervalId = setInterval(async () => {
        const result2 = await getFavoriteMovie()
      }, 5000)

      const intervalId1 = setInterval(async () => {
        const result3 = await getFavoriteShow()
      }, 5000)
    }

    fetchData()
  }, [])

  if (isAuthenticated && favMovie && favShow) {
    return (
      <>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="mx-auto mt-7 text-3xl font-bold">
              Welcome {userData.first_name} {userData.last_name}!
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          <Container className="my-6">
            <p className="text-xl font-medium">Your favorite movies are: </p>
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
                    <TableCell key="Genres">Genres</TableCell>
                    <TableCell key="Language">Language</TableCell>
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
          {/* Another container */}
          <Container className="my-6">
            <p className="text-xl font-medium">Your favorite shows are: </p>
            {selectedShowTitle && (
              <ShowCard
                showName={selectedShowTitle}
                handleClose={() => setSelectedShowTitle(null)}
              />
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell key="Title">Title</TableCell>
                    <TableCell key="release_year">Release Year</TableCell>
                    <TableCell key="date_added">date_added</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {favShow.map((myShow) => (
                    <TableRow key={myShow.show_id}>
                      <TableCell key="Title">
                        <Link
                          onClick={() => setSelectedShowTitle(myShow.title)}
                        >
                          {myShow.title}
                        </Link>
                      </TableCell>
                      <TableCell key="release_year">
                        {myShow.release_year}
                      </TableCell>
                      <TableCell key="date_added">
                        {myShow.date_added}
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
  } else if (isAuthenticated) {
    return (
      <>
        <p className="m-8 text-lg font-bold">Loading...</p>
      </>
    )
  } else {
    return (
      <Container className='p-8'>
        <p> Your session has expired. Click here to return back to login</p>
        <Link className="text-blue-500 hover:underline focus:underline" to="/">
          Login
        </Link>
      </Container>
    )
  }
}

export default UserPage
