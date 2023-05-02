// Will consolidate into the SearchPage later once I figure out how to make the tables not display 100 rows at a time


import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, Link, MenuItem, Select, Slider, Switch, TextField } from '@mui/material';
import { codes, listOfSovereignStates, movieGenres, movieRatings, tvRatings } from '../utils';
import StreamMovieCard from './StreamMovieCard';
const config = require('../config.json');




function StreamableTable() {

  // States and Refs
  const [pageSize, setPageSize] = useState(5);
  const [results, setResults] = useState([]);   // what is displayed in the table

  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState([0, 400000000]);
  const [language, setLanguage] = useState('');
  const [displayLanguage, setDisplayLanguage] = useState('');
  const [genres, setGenres] = useState([]);
  const [releaseYear, setReleaseYear] = useState([1874, 2023]);
  const [description, setDescription] = useState('');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState([]);
  const [rating, setRating] = useState('');
  const [amazon, setAmazon] = useState(false);
  const [disney, setDisney] = useState(false);
  const [hulu, setHulu] = useState(false);
  const [netflix, setNetflix] = useState(true);
  const [selectedShowName, setSelectedShowName] = useState('');

  // const [selectedShowName, setSelectedShowName] = useState(null);
  const castParams = new URLSearchParams();
  const genreParams = new URLSearchParams();



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
    fetch(`http://${config.server_host}:${config.server_port}/search_movies?netflix=true`)
      .then(res => res.json())
      .then(resJson => {
        const retrieved = resJson.map((show) => ({ id: show.title, ...show }));
        setResults(retrieved);
        // console.log(duration[0]);
       //  console.log(duration[1]);
      });
  }, []);
  
  
  const search = () => {
    genreParams.set("genres", "[" + genres.map(g => `"${g}"`).join(",") + "]");
    castParams.set("cast", "[" + cast.map(g => `"${g}"`).join(",") + "]");
    console.log(castParams.toString());
    
    fetch(`http://${config.server_host}:${config.server_port}/search_movies?` +
      `amazon=${amazon}&disney=${disney}&hulu=${hulu}&netflix=${netflix}&title=${title}&director=${director}&releaseYearMin=${releaseYear[0]}`
      + `&releaseYearMax=${releaseYear[1]}&rating=${rating}&budgetMin=${budget[0]}&budgetMax=${budget[1]}&originalLanguage=${language}` +
      `&${castParams.toString()}&${genreParams.toString()}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const returned = resJson.map((show) => {let seasonText = show.duration === 1 ? 'Season' : 'Seasons';
        return { id: show.title, ...show, durationText: `${show.duration} ${seasonText}` };});
      // }(
          // { id: show.show_id, ...show }));
        setResults(returned);
      });

      
      
      /*
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
     */
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
    { field: 'budget', headerName: 'Budget' },
    { field: 'genres', headerName: 'Genres' },
    { field: 'original_language', headerName: 'Language' },
    { field: 'description', headerName: 'Description' },
    { field: 'release_year', headerName: 'Release Year' },
    { field: 'director', headerName: 'Director' },
    { field: 'cast', headerName: 'Cast' },
    { field: 'rating', headerName: 'Rating' }
  ]



  return (
    <Container>
      {selectedShowName && <StreamMovieCard showName={selectedShowName} handleClose={() => setSelectedShowName(null)} />}
    
    
    <Grid container spacing={2}>

    <Grid item xs={3}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
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
            value={genres}
            label="genre"
            onChange={(e)=> setGenres([e.target.value])}
          >
            {movieGenres.map((index) => {
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
      
      <Grid item xs={3}>
      <FormControl fullWidth>
        <InputLabel id="rating-form">Language</InputLabel>
        <Select
          labelId="rating"
          id="ratingForm"
          value={displayLanguage}
          label="Age"
          onChange={
            (e)=> {setLanguage(codes[e.target.value]);
            setDisplayLanguage(e.target.value)}}
        >
          {Object.keys(codes).sort().map((index) =>
            <MenuItem value={index}>{index}</MenuItem>
          )}

        </Select>
      </FormControl>
      </Grid>
      
      </Grid>


      <Container class='my-4'>
        <Grid container spacing={5}>

          <Grid item xs={5}>
            <p>Budget</p>
            <Slider
              value={budget}
              min={0}
              max={400000000}
              step={4000000}
              onChange={(e, newValue) => setBudget(newValue)}
              valueLabelDisplay='auto'
              valueLabelFormat={value => <div> {value} </div>}
            />
          </Grid>

          <Grid item xs={5}>
            <p>Release Year</p>
            <Slider
              value={releaseYear}
              min={1874}
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

          <Grid item xs={4}>
            <TextField label='Director' value={director} onChange={(e) => setDirector(e.target.value)} style={{ width: "100%" }}/>
          </Grid>

          <Grid item xs={4}>
            <TextField label='Cast' value={cast} onChange={(e) => setCast([e.target.value])} style={{ width: "100%" }}/>
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
              {movieRatings.map((index) => {
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
        </Grid>
      </Container>

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      

    

      
            

            
        
        <p class='text-2xl font-medium my-6'>Results</p>

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
      />
     
            







    
  </Container>

  
  );


  
}

export default StreamableTable;