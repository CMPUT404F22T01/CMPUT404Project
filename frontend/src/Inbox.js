import * as React from "react"; 
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "./axiosInstance";


const Inbox = ({ onClickInboxHandler }) => {

  const navigate = useNavigate();
  const [inboxData, setInboxData] = useState([])
  
  useEffect(() => {
    axiosInstance.get(`authors/${localStorage.getItem("id")}/inboxAll`)
    .then((response) => {   
      setInboxData(response.data.items)
    })
    .catch((error) => {
      console.error(error);
    })
  }, [])
   

  const allMessages = inboxData.map((value) => {   
    return (
        <> 
        {/* onClick is for heroku so won't work in localhost onClick={()=> navigate(value.id)}'*/}
       <ListItem button >
        <ListItemText primary={`${value.data.author.username}`} secondary={`${value.message}`} />
      </ListItem>
      <Divider />
      </>
    )
  }); 

  
  return (
    <>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClickInboxHandler}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Inbox
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
         {allMessages}
      </List>
    </>
  );
};

export default Inbox;
