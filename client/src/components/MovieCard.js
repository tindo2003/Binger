import {commaSeparated} from '../utils.js';
import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal, Typography } from '@mui/material';
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

// import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function MovieCard({ showName, handleClose }) {
  const [showData, setShowData] = useState({});
  const [streamingData, setStreamingData] = useState([]);
  // const [albumData, setAlbumData] = useState({});

  // const [barRadar, setBarRadar] = useState(true);

 useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/movie/${showName}`)
      .then(res => res.json())
      .then(resJson => {
        setShowData(resJson);
        // const albumId = resJson.album_id;
        
      });
  }, []);
/*
  const chartData = [
    { name: 'Danceability', value: songData.danceability },
    { name: 'Energy', value: songData.energy },
    { name: 'Valence', value: songData.valence },
  ];
  */
/*
  const handleGraphChange = () => {
    setBarRadar(!barRadar);
  };
  */

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <Typography variant="h2">{showData.original_title}</Typography>
        <h2>Budget: {showData.budget !== 0 ? showData.budget: 'N/A'}
          
        </h2>

        <p>Genres: {showData.genres }</p>
        <p>Language: {showData.original_language} </p>
        <p>Description: {showData.overview}</p>
        {showData && showData.modified_release_year && (
          <p>Release Year: {showData.modified_release_year.slice(0, 4)}</p>
        )}
        

        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}