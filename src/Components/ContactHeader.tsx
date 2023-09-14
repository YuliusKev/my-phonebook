import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';


export default function ContactHeader() {
  return (
    <>
      <Toolbar sx={{ bgcolor: '#1e1e1e'}}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "white"}}>
          Contact List
        </Typography>
        <Button href="/input-contact">
          <Typography variant="h6"  sx={{ flexGrow: 1, color: "white"}}> + </Typography>
        </Button>
      </Toolbar>
      <Divider sx={{ bgcolor: "grey", opacity:0.5}}/>
    </>
  );
}