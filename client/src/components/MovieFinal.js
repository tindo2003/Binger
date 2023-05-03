import StreamableTable from './StreamableTable';
import SearchMoviePage from './SearchMovieComponent';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, Link, MenuItem, Select, Slider, Switch, TextField } from '@mui/material';
import { codes, listOfSovereignStates, movieGenres, movieRatings, tvRatings } from '../utils';
import MovieCard from './MovieCard';
const config = require('../config.json');

function MovieFinal() {


  const [checked, setChecked] = useState(false);


  function handleChange() {
    setChecked(!checked);

  }

  return (
    <Container maxWidth="xl">
      <p class='text-3xl font-semibold mt-10 mb-4'>Search Movies</p>
      <FormControlLabel control={<Switch onChange={handleChange} color="secondary"/>} label="View Streamable" class='m-6'/>
      {checked && <StreamableTable />}
      {!checked && <SearchMoviePage />}
    </Container>
  );
   
    

  



}

export default MovieFinal;


