import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, FormControl, Grid, InputLabel, Link, MenuItem, Select, Slider, TextField } from '@mui/material';
import { listOfSovereignStates, tvGenres, tvRatings } from '../utils';
import ShowCard from './ShowCard';
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
  const [service, setService] = useState('');
  const [selectedShowName, setSelectedShowName] = useState(null);



  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_shows`)
      .then(res => res.json())
      .then(resJson => {
        const retrieved = resJson.map((show) => ({ id: show.show_id, ...show }));
        setResults(retrieved);
        console.log(duration[0]);
        console.log(duration[1]);
      });
  }, []);

  const search = () => {
    
    fetch(`http://${config.server_host}:${config.server_port}/search_shows?stream=${service}` +
      
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
     console.log(service);
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
    { field: 'director', headerName: 'Director' },
    { field: 'cast', headerName: 'Cast' },
    { field: 'country', headerName: 'Country' },
    { field: 'release_year', headerName: 'Release Year' },
    { field: 'rating', headerName: 'Rating' },
    { field: 'duration', headerName: 'Duration (Seasons)' },
    { field: 'listed_in', headerName: 'Genres' },
    { field: 'description', headerName: 'Description' },
  ]

  return (
    <Container>
    {selectedShowName && <ShowCard showName={selectedShowName} handleClose={() => setSelectedShowName(null)} />}
    <h2>Search Shows</h2>
    <Grid container spacing={0}>

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


      <Grid item xs={3}>
        <FormControl fullWidth>
          <InputLabel id="rating-form">Genre</InputLabel>
          <Select
            labelId="genre"
            id="genreForm"
            value={listedIn}
            label="genre"
            onChange={(e)=> setListedIn(e.target.value)}
          >
            {tvGenres.map((index) =>
              <MenuItem value={index}>{index}</MenuItem>
            )}

          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={3}>
      <FormControl fullWidth>
        <InputLabel id="rating-form">Content Rating</InputLabel>
        <Select
          labelId="rating"
          id="ratingForm"
          value={rating}
          label="Age"
          onChange={(e)=> setRating(e.target.value)}
        >
          {tvRatings.map((index) =>
            <MenuItem value={index}>{index}</MenuItem>
          )}

        </Select>
      </FormControl>
      </Grid>
      


      <Grid item xs={3}>
      <FormControl fullWidth>
        <InputLabel id="country-form">Country</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={country}
          label="Age"
          onChange={(e)=> setCountry(e.target.value)}
        >
          {listOfSovereignStates.map((index) =>
            <MenuItem value={index}>{index}</MenuItem>
          )}
        </Select>
      </FormControl>
      </Grid>

      <Grid item xs={3}>
      <FormControl fullWidth>
        <InputLabel id="service-form">Service</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={service}
          label="Streaming Service"
          onChange={(e)=> setService(e.target.value)}
        >
          <MenuItem value={"Amazon"}>Amazon</MenuItem>
          <MenuItem value={"Disney"}>Disney</MenuItem>
          <MenuItem value={"Hulu"}>Hulu</MenuItem>
          <MenuItem value={"Netflix"}>Netflix</MenuItem>

        </Select>
      </FormControl>
      </Grid>
      



      </Grid>




      <Grid container spacing={5}>

      <Grid item xs={6}>
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

      <Grid item xs={6}>
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

        </Grid>
        <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

        <h2>Results</h2>

        <DataGrid
        rows={results}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        checkboxSelection
        autoHeight
      />
     
            







    
  </Container>
  );
}

export default SearchPage;