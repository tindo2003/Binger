/*
<Grid container spacing={6}>
      
      <Grid item xs={12}>
        <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
      </Grid>

      <Grid item xs={12}>
        <TextField label='Director' value={director} onChange={(e) => setDirector(e.target.value)} style={{ width: "100%" }}/>
      </Grid>

      <Grid item xs={12}>
        <TextField label='Cast' value={cast} onChange={(e) => setCast(e.target.value)} style={{ width: "100%" }}/>
      </Grid>

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

      <Grid item xs={6}>
        <p>Number of Seasons</p>
        <Slider
          value={duration}
          min={1}
          max={34}
          step={1}
          onChange={(e, newValue) => setDuration(newValue)}
          valueLabelDisplay='auto'
          valueLabelFormat={value => <div>{value} Seasons </div>}
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
*/

     //  {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
      
    //   {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
  /*
    </Grid>
    
    <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
      Search
    </Button>
    <h2>Results</h2>


    */




   //  {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}


   /* 
    <DataGrid
      rows={results}
      columns={columns}
      pageSize={pageSize}
      rowsPerPageOptions={[5, 10, 25]}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      autoHeight
    />


    */

/*

    ${genreConditions}
          (original_language LIKE '%${originalLanguage}%' ${oLNull} AND
          overview LIKE '%${overview}%' ${overviewNull} AND
          original_title LIKE '%${original_title}%' ${oTNull} AND
          modified_release_year BETWEEN '${releaseYearMin}' AND '${releaseYearMax}'

          */


/*
          </Grid>
        <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      */


/*            Toggle Amazon, Disney, Hulu, Netflix,

      <FormGroup>
  <FormControlLabel control={<Switch defaultChecked />} label="Label" />
  <FormControlLabel required control={<Switch />} label="Required" />
  <FormControlLabel disabled control={<Switch />} label="Disabled" />
</FormGroup>

  <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>


*/