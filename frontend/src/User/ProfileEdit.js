import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import { TextField } from '@mui/material';

import { useState } from "react";
import { useRef } from "react";
import axiosInstance from "../utils/axiosInstance";

// https://mui.com/material-ui/react-dialog/

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {

  const { openDialog, setOpenDialog, displayName, githubURL} = props;

  //const [display, setDisplayName] = useState(displayName);
  //const [github, setGithub] = useState(githubURL);
  const display = useRef(displayName);
  const github = useRef(githubURL);

  const handleOnClickSubmit = () => {
    var newDisplay = display.current.value;
    var newGithub = github.current.value;
    axiosInstance
    .post(`authors/${localStorage.getItem("id")}/`, {
      "displayName": newDisplay, 
      "github": newGithub
    })
    .then((response) => {
      console.log(response.status);
    })
    .catch((error) => {
      console.log(error);      
    });
    setOpenDialog(false);
  }



  return (
    <div>
      <BootstrapDialog
        onClose={()=>{setOpenDialog(false)}}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={()=>{setOpenDialog(false)}}>
          Edit Profile
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                id="display-name"
                label="Display Name"
                defaultValue={displayName}
                inputRef={display}/>
            </Grid>
            <Grid item>
              <TextField
                id="github-url"
                label="GitHub"
                defaultValue={githubURL}
                inputRef={github}/>

            </Grid>
          </Grid>
       
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleOnClickSubmit}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
    
