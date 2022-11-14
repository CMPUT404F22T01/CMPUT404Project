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
import { useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Avatar} from "@mui/material";

// https://mui.com/material-ui/react-dialog/

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
    minWidth: 300
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
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
  const imageRef = useRef(null);

  const handleOnClickSubmit = async () => {
    let url = `authors/${localStorage.getItem("id")}/`;
    let formData = new FormData();
    formData.append("displayName", display.current.value);
    formData.append("github", github.current.value);
    formData.append(
      "profileImage",
      imageRef.current.files[0] ? imageRef.current.files[0] : ""
    );

    axiosInstance.post(url, formData)
    .then((response) => {
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
     
    setOpenDialog(false);


    /*
    var newDisplay = display.current.value;
    var newGithub = github.current.value;
    axiosInstance
    .post(`authors/${localStorage.getItem("id")}/`, {
      "displayName": newDisplay, 
      "github": newGithub,
      //"profileImage": image
    })
    .then((response) => {
      alert(response.data)
      console.log(response.status);
    })
    .catch((error) => {
      alert(error)
      console.log(error);      
    });
    */
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
          <Grid container direction="column" spacing={2}  >
            <Grid item >
              <label htmlFor="image">
                <input
                  style={{ display: "none" }}
                  id="image"
                  accept="image/*"
                  type="file"
                  ref={imageRef}
                />
                <IconButton component="span">
                  <Avatar 
                    src="https://media.tacdn.com/media/attractions-splice-spp-674x446/09/c3/33/97.jpg" 
                    style={{
                      width: "150px",
                      height: "150px",
                      marginBottom: "20px"
                    }} 
                  />
                  </IconButton>
              </label>
            </Grid>
            <Grid item>
              <TextField
                id="display-name"
                label="Display Name"
                defaultValue={displayName}
                inputRef={display}
                fullWidth/>
            </Grid>
            <Grid item>
              <TextField
                id="github-url"
                label="GitHub"
                defaultValue={githubURL}
                inputRef={github}
                fullWidth/>

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
    
