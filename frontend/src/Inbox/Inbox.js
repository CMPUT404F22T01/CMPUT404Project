import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import { Button, Box } from "@mui/material";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/axiosInstance";

const Inbox = ({ onClickInboxHandler }) => {
  const navigate = useNavigate();
  const [inboxData, setInboxData] = useState([]);
  const [reRenderInbox, setReRenderInbox] = useState(false);

  /**
   * on load loading the current user's inbox
   */
  useEffect(() => {
    axiosInstance
      .get(`authors/${localStorage.getItem("id")}/inboxAll/`)
      .then((response) => {
        setInboxData(response.data.items);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reRenderInbox]);

  const clearInboxFollowRequest = (id) => {
    axiosInstance
    .delete(`authors/${localStorage.getItem("id")}/inboxAll/`, {
      data: { id: id },
    })
    .then(() => {
       setReRenderInbox(true);
    });

  }
  const onClickFollowRequestAcceptHandler = (id) => {
    axiosInstance
      .put(
        `authors/${localStorage.getItem("id")}/followers/${
          id.split("authors/")[1]
        }`
      )
      .then((response) => {
         clearInboxFollowRequest(id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onClickFollowRequestDeclineHandler = (id) => {
    clearInboxFollowRequest(id);
  };

  const allMessages = inboxData.map((value) => {
    // author means a follow request here
    const authorData =
      value.data.type === "author" ? value.data : value.data.author;
    return (
      <>
        {/* onClick is for heroku so won't work in localhost onClick={()=> navigate(value.id)}'*/}
        <ListItem
          button
          onClick={
            value.data.type === "post"
              ? () => navigate(value.data.id)
              : () => navigate("/profile", { state: { authorData } })
          }
        >
          <ListItemText
            primary={`${value.data.type}`}
            secondary={`${value.message}`}
          />
        </ListItem>
        {value.data.type === "author" ? (
          <Box>
            <Button
              onClick={() => onClickFollowRequestAcceptHandler(value.data.id)}
            >
              Accept
            </Button>
            <Button
              onClick={() => onClickFollowRequestDeclineHandler(value.data.id)}
            >
              Decline
            </Button>
          </Box>
        ) : (
          ""
        )}

        <Divider />
      </>
    );
  });

  return (
    <>
      <AppBar sx={{ position: "relative", backgroundColor: "#23395d"}}>
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
      <List>{allMessages}</List>
    </>
  );
};

export default Inbox;
