import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';


function SearchPage() {

  // States and Refs
  const [results, setResults] = useState([]);   // what is displayed in the table



  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_shows`)
      .then(res => res.json())
      .then(resJson => {
        const retrieved = resJson.map((show) => ({ id: show.show_id, ...show }));
        setResults(retrieved);
      });
  }, []);


  const columns = [
    /*
    { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedSongId(params.row.song_id)}>{params.value}</Link>
    ) },
    */
    { field: 'title', headerName: 'Title' },
    { field: 'director', headerName: 'Director' },
    { field: 'cast', headerName: 'Cast' },
    { field: 'country', headerName: 'Country' },
    { field: 'release_year', headerName: 'Release Year' },
    { field: '', headerName: 'Tempo' },
    { field: 'key_mode', headerName: 'Key' },
    { field: 'explicit', headerName: 'Explicit' },
  ]

  return (
    <div >
      <p>
        Test
      </p>
    </div>
  );
}

export default SearchPage;