import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Avatar,
  CardActions,
  Typography,
  TextField,
} from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";

import CardMedia from "@mui/material/CardMedia";

import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
 

import axiosInstance from "./axiosInstance";

import "./UserProfile.css";

import Collapse from "@mui/material/Collapse";
/**
 * The edit part appears on the very top of the page need to deal with it too
 * Deal with images
 */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const UserProfile = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = React.useState(false);

  const onClickDeletePost = (index) => {
    console.log(data[index].id);
    axiosInstance
      .delete(`authors/${localStorage.getItem("id")}/posts/${data[index].id}/`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const url = 'http://127.0.0.1:8000/mainDB/user/data/'
  // const config = {
  //     headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  // };

  useEffect(() => {
    axiosInstance
      .get(`authors/${localStorage.getItem("id")}/posts/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("error in post get ", error);
      });
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const allpost = data.map((item, index) => {
    if (item.author.id === localStorage.getItem("id")) {
      return (
        <Typography paragraph className="card-container">
          <Card sx={{ maxWidth: 1000 }} className="card-view">
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  R
                </Avatar>
              }
              action={
                <IconButton aria-label="delete">
                  {/* to allow author to edit its own post */}
                  {item.author.id === localStorage.getItem("id") ? (
                  <DeleteIcon onClick={() => onClickDeletePost(index)} />
                  ) : (
                    ""
                  )}
                </IconButton>
              }
              title={item.title}
              subheader={item.published}
            />

            {/* <CardMedia
                    component="img"
                    height="394"
                    image="https://mui.com/static/images/cards/paella.jpg"
                    alt="Paella dish"
                  /> */}
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {item.content}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <CommentIcon />
              </IconButton>
              
            </CardActions>
             
          </Card>
        </Typography>
      );
    }
  });

  return (
    <>
      <Card className="user-profile-card" sx={{backgroundColor: '#333'}}>
        <CardContent>
          <Avatar
            src="https://media.tacdn.com/media/attractions-splice-spp-674x446/09/c3/33/97.jpg"
            className="profile-img"
            sx={{ width: 100, height: 100 }}
          />
          <Typography
            variant="h5"
            component="h2"
            className="user-name"
          >DisplayName</Typography>
          <Typography
            variant="h6"
            component="h2"
            className="user-name"
          ></Typography>
          <Typography
            variant="h6"
            component="h2"
            className="user-name"
          ></Typography>
          <div className="fcontainer">
            <Box className="fbox">Follwers</Box>

            <Box className="fbox">Following</Box>

            <Box className="fbox">Bff</Box>
          </div>
        </CardContent>
      </Card>
      <div className="post">{allpost}</div>
    </>
  );
};

export default UserProfile;
