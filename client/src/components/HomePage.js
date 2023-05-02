import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Container, Divider, Grid, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate, Link } from 'react-router-dom'
import StreamMovieCard from './StreamMovieCard';
import MovieCard from './MovieCard';

const config = require('../config.json')

// use this whenever you want the route protected?

function HomePage() {
  const setHeaders = () => {
    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem(
      'app-token',
    )
  }

  const [platform, setPlatform] = useState("Netflix");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [topStreamMovies, setTopStreamMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate()
  // run this before the component is rerendered. 
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/streamtop?service=${platform}`)
      .then(res => res.json())
      .then(resJson => {
        const result = resJson.map((movie) => {
          return { id: movie.movieId, ...movie };
        });
        setTopStreamMovies(result);
      }
    );
  }, [platform])

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/movietop`)
      .then(res => res.json())
      .then(resJson => {
        const result = resJson.map((movie) => {
          return { id: movie.movieId, ...movie };
        });
        console.log(result);
        setTopMovies(result);
      }
    );
  }, [])

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
  };

  const columnsStream = [
    { field: 'Title', headerName: 'Title', width: 300, renderCell: (params) => (
      <Link onClick={() => setSelectedStream(params.row.Title)}>{params.value}</Link>
      )
    },
    { field: 'AverageRating', width: 300, headerName: 'Average Rating' },
  ]

  const columnsMovie = [
    { field: 'Title', headerName: 'Title', width: 300, renderCell: (params) => (
      <Link onClick={() => setSelectedMovie(params.row.Title)}>{params.value}</Link>
      )
    },
    { field: 'AverageRating', width: 300, headerName: 'Average Rating' },
  ]

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

  if (isAuthenticated) {
    return (
      <Container className='p-8'>
        {selectedStream && <StreamMovieCard showName={selectedStream} handleClose={() => setSelectedStream(null)} />}
        {selectedMovie && <MovieCard showName={selectedMovie} handleClose={() => setSelectedMovie(null)} />}
        <p className='text-5xl font-bold my-4'>Welcome to BINGER.</p>
        <p className='text-xl mb-7'>This is your one-stop shop for all your binge-watching needs. Find the content you love.</p>
        <Divider />
        <p class='text-3xl font-medium mt-8'>BEST CONTENT</p>
        <Container className='mt-6' style={{ minHeight: '64vh' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <p className='text-2xl font-semibold my-2'>Top 10 Movies (Streaming)</p>
              <FormControl component="fieldset" className='my-2'>
                <RadioGroup aria-label="streaming" name="streaming" value={platform} onChange={handlePlatformChange} row>
                  <FormControlLabel value="Netflix" control={<Radio />} label="Netflix" />
                  <FormControlLabel value="Amazon" control={<Radio />} label="Amazon" />
                  <FormControlLabel value="Disney" control={<Radio />} label="Disney" />
                  <FormControlLabel value="Hulu" control={<Radio />} label="Hulu" />
                </RadioGroup>
              </FormControl>
              <div style={{ height: 'calc(76vh - 250px)', width: '100%' }}>
                <DataGrid
                  rows={topStreamMovies}
                  columns={columnsStream}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <p className='text-2xl font-semibold mt-2'>Top 100 Movies (Overall)</p>
              <div style={{height:'3.1em'}}></div>
              <div style={{ height: 'calc(76vh - 250px)', width: '100%' }}>
                <DataGrid
                  rows={topMovies}
                  columns={columnsMovie}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                />
              </div>
            </Grid>
          </Grid>
        </Container>
        <Divider />
        <p className='text-3xl font-medium mt-8'>RECOMMENDATIONS</p>
      </Container>
    )
  } else {
    return (
      <Container class='p-8'>
        <p> Your session has expired. Click here to return back to login</p>
        {
          <Link
            className="text-blue-500 hover:underline focus:underline"
            to="/"
          >
            Login
          </Link>
        }{' '}
      </Container>
    )
  }

  // return (
  //   <Container className='p-8'>
  //     {selectedStream && <StreamMovieCard showName={selectedStream} handleClose={() => setSelectedStream(null)} />}
  //     {selectedMovie && <MovieCard showName={selectedMovie} handleClose={() => setSelectedMovie(null)} />}
  //     <p className='text-5xl font-bold my-4'>Welcome to BINGER.</p>
  //     <p className='text-xl mb-7'>This is your one-stop shop for all your binge-watching needs. Find the content you love.</p>
  //     <Divider />
  //     <p class='text-3xl font-medium mt-8'>BEST CONTENT</p>
  //     <Container className='mt-6' style={{ minHeight: '64vh' }}>
  //       <Grid container spacing={2}>
  //         <Grid item xs={6}>
  //           <p className='text-2xl font-semibold my-2'>Top 10 Movies (Streaming)</p>
  //           <FormControl component="fieldset" className='my-2'>
  //             <RadioGroup aria-label="streaming" name="streaming" value={platform} onChange={handlePlatformChange} row>
  //               <FormControlLabel value="Netflix" control={<Radio />} label="Netflix" />
  //               <FormControlLabel value="Amazon" control={<Radio />} label="Amazon" />
  //               <FormControlLabel value="Disney" control={<Radio />} label="Disney" />
  //               <FormControlLabel value="Hulu" control={<Radio />} label="Hulu" />
  //             </RadioGroup>
  //           </FormControl>
  //           <div style={{ height: 'calc(76vh - 250px)', width: '100%' }}>
  //             <DataGrid
  //               rows={topStreamMovies}
  //               columns={columnsStream}
  //               initialState={{
  //                 pagination: {
  //                   paginationModel: {
  //                     pageSize: 5,
  //                   },
  //                 },
  //               }}
  //               pageSizeOptions={[5, 10]}
  //             />
  //           </div>
  //         </Grid>
  //         <Grid item xs={6}>
  //           <p className='text-2xl font-semibold mt-2'>Top 100 Movies (Overall)</p>
  //           <div style={{height:'3.1em'}}></div>
  //           <div style={{ height: 'calc(76vh - 250px)', width: '100%' }}>
  //             <DataGrid
  //               rows={topMovies}
  //               columns={columnsMovie}
  //               initialState={{
  //                 pagination: {
  //                   paginationModel: {
  //                     pageSize: 5,
  //                   },
  //                 },
  //               }}
  //               pageSizeOptions={[5, 10, 25]}
  //             />
  //           </div>
  //         </Grid>
  //       </Grid>
  //     </Container>
  //     <Divider />
  //     <p className='text-3xl font-medium mt-8'>RECOMMENDATIONS</p>
  //   </Container>
  // )
}

export default HomePage
