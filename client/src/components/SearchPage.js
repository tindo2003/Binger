import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, FormControl, FormControlLabel, Grid, InputLabel, Link, MenuItem, Select, Slider, Switch, TextField } from '@mui/material';
import { listOfSovereignStates, tvGenres, tvRatings } from '../utils';
import ShowCard from './ShowCard';
import MovieFinal from './MovieFinal';
const config = require('../config.json');




function SearchPage() {

  // States and Refs
  const [pageSize, setPageSize] = useState(5);
  const [results, setResults] = useState([]);   // what is displayed in the table

  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState('');
  const [duration, setDuration] = useState([1, 34]);
  const [releaseYear, setReleaseYear] = useState([1900, 2023]);
  const [listedIn, setListedIn] = useState('');
  const [description, setDescription] = useState('');
  const [selectedShowName, setSelectedShowName] = useState(null);
  const [amazon, setAmazon] = useState(false);
  const [disney, setDisney] = useState(false);
  const [hulu, setHulu] = useState(false);
  const [netflix, setNetflix] = useState(true);

  function handelChange(e) {
    if (e.target.name === 'Amazon') {
      setAmazon(!amazon)
    } else if (e.target.name === 'Disney') {
      setDisney(!disney);
    } else if (e.target.name === 'Hulu') {
      setHulu(!hulu);
    } else {
      setNetflix(!netflix);
      console.log(netflix);
    }
  }



  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_shows?netflix=true`)
      .then(res => res.json())
      .then(resJson => {
        const retrieved = resJson.map((show) => ({ id: show.show_id, ...show }));
        setResults(retrieved);
        console.log(duration[0]);
        console.log(duration[1]);
      });
  }, []);

  const search = () => {
    
    fetch(`http://${config.server_host}:${config.server_port}/search_shows?netflix=${netflix}&hulu=${hulu}&amazon=${amazon}&disney=${disney}` +
      
    `&title=${title}&director=${director}` +
      `&cast=${cast}&country=${country}` +
      `&releaseYearMin=${releaseYear[0]}&releaseYearMax=${releaseYear[1]}` +
      `&rating=${rating}&durationMin=${duration[0]}` +
      `&durationMax=${duration[1]}&listedIn=${listedIn}`
      
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const returned = resJson.map((show) => {let seasonText = show.duration === 1 ? 'Season' : 'Seasons';
        return { id: show.show_id, ...show, durationText: `${show.duration} ${seasonText}` };});
      // }(
          // { id: show.show_id, ...show }));
        setResults(returned);
      });
      
     console.log("Button press");
     // console.log(service);
     console.log(title);
     console.log(director);
     console.log(cast);
     console.log(country);
     console.log(releaseYear[0]);
     console.log(releaseYear[1]);
     console.log(rating);
     console.log(duration[0]);
     console.log(duration[1]);
     console.log(listedIn);
  }


  const columns = [
    /*
    { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
    ) },
    */
    { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
      <Link onClick={() => setSelectedShowName(params.row.title)}>{params.value}</Link>
  ) },
    // { field: 'title', headerName: 'Title' },
    { field: 'director', width: 130, headerName: 'Director' },
    { field: 'cast', width: 150, headerName: 'Cast' },
    { field: 'country', width: 130, headerName: 'Country' },
    { field: 'release_year', width: 100, headerName: 'Release Year' },
    { field: 'rating', width: 80, headerName: 'Rating' },
    { field: 'duration', width: 100, headerName: 'Duration (Seasons)' },
    { field: 'listed_in', width: 150, headerName: 'Genres' },
    { field: 'description', width: 200, headerName: 'Description' },
  ]

  return (
    <Container class='py-8 px-10'>
      {selectedShowName && <ShowCard showName={selectedShowName} handleClose={() => setSelectedShowName(null)} />}

      <p class='text-3xl font-semibold my-4'>Search Shows</p>
      <Grid container spacing={1}>

        <Grid item xs={3}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={3}>
          <TextField label='Director' value={director} onChange={(e) => setDirector(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={3}>
          <TextField label='Cast' value={cast} onChange={(e) => setCast(e.target.value)} style={{ width: "100%" }}/>
        </Grid>

        <Grid item xs={3}>
          <TextField label='Description' value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%" }}/>
        </Grid>


        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="rating-form">Genre</InputLabel>
            <Select
              labelId="genre"
              id="genreForm"
              value={listedIn}
              label="genre"
              onChange={(e)=> setListedIn(e.target.value)}
            >
              {tvGenres.map((index) => {
                if (index === "") {
                  return <MenuItem value={index}>All Genres</MenuItem>
                } else {
                  return <MenuItem value={index}>{index}</MenuItem>
                }
                
              }
                
              )}

            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="rating-form">Content Rating</InputLabel>
          <Select
            labelId="rating"
            id="ratingForm"
            value={rating}
            label="Age"
            onChange={(e)=> setRating(e.target.value)}
          >
            {tvRatings.map((index) => {
                if (index === "") {
                  return <MenuItem value={index}>All Ratings</MenuItem>
                } else {
                  return <MenuItem value={index}>{index}</MenuItem>
                }
                
              }
                
              )}

          </Select>
        </FormControl>
        </Grid>
        


        <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="country-form">Country</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={country}
            label="Age"
            onChange={(e)=> setCountry(e.target.value)}
          >
            {listOfSovereignStates.map((index) => {
                if (index === "") {
                  return <MenuItem value={index}>All Countries</MenuItem>
                } else {
                  return <MenuItem value={index}>{index}</MenuItem>
                }
                
              }
                
              )}
          </Select>
        </FormControl>
        </Grid>
      </Grid>
      <Container class='my-2'>
      <Grid container spacing={5}>
        <Grid item xs={5}>
          <p>Number of Seasons</p>
          <Slider
            value={duration}
            min={1}
            max={34}
            step={1}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div> {value} Seasons </div>}
          />
        </Grid>

        <Grid item xs={5}>
          <p>Release Year</p>
          <Slider
            value={releaseYear}
            min={1900}
            max={2023}
            step={1}
            onChange={(e, newValue) => setReleaseYear(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>

        <Grid item xs={2}>
              <FormControlLabel control={<Switch onChange={handelChange} name="Amazon"/>}  label="Amazon" />
              <FormControlLabel control={<Switch onChange={handelChange} name="Disney" />}  label="Disney" />
              <FormControlLabel control={<Switch onChange={handelChange} name="Hulu" />}  label="Hulu" />
              <FormControlLabel control={<Switch checked={netflix} onChange={handelChange} name="Netflix" />}  label="Netflix" />

        </Grid>

      </Grid>
      </Container>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)'}}>
        Search
      </Button>
      <p class='text-2xl font-medium my-3'>Results</p>
      <DataGrid
        rows={results}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        class='mb-10'
      />
      <MovieFinal/>
    </Container>
  );
}

export default SearchPage;