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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
                <IconButton aria-label="settings">
                  {/* to allow author to edit its own post */}
                  {item.author.id === localStorage.getItem("id") ? (
                    <MoreVertIcon onClick={() => onClickDeletePost(index)} />
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
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>Method:</Typography>
                <Typography paragraph>
                  Heat 1/2 cup of the broth in a pot until simmering, add
                  saffron and set aside for 10 minutes.
                </Typography>
                <Typography paragraph>
                  Heat oil in a (14- to 16-inch) paella pan or a large, deep
                  skillet over medium-high heat. Add chicken, shrimp and
                  chorizo, and cook, stirring occasionally until lightly
                  browned, 6 to 8 minutes. Transfer shrimp to a large plate and
                  set aside, leaving chicken and chorizo in the pan. Add
                  pimentón, bay leaves, garlic, tomatoes, onion, salt and
                  pepper, and cook, stirring often until thickened and fragrant,
                  about 10 minutes. Add saffron broth and remaining 4 1/2 cups
                  chicken broth; bring to a boil.
                </Typography>
                <Typography paragraph>
                  Add rice and stir very gently to distribute. Top with
                  artichokes and peppers, and cook without stirring, until most
                  of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                  medium-low, add reserved shrimp and mussels, tucking them down
                  into the rice, and cook again without stirring, until mussels
                  have opened and rice is just tender, 5 to 7 minutes more.
                  (Discard any mussels that don&apos;t open.)
                </Typography>
                <Typography>
                  Set aside off of the heat to let rest for 10 minutes, and then
                  serve.
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Typography>
      );
    }
  });

  return (
    <>
      <Card className="user-profile-card">
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
          ></Typography>
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
            <p>10</p>
            <p>20</p>
            <p>10</p>
          </div>
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
