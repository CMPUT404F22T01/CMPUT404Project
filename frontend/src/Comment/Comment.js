import {
  Box,
  Typography, 
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { makeStyles } from "@mui/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AllCommentLikes from "../Likes/AllCommentLikes";

const useStyles = makeStyles({
  allCommentsContainer: {
    display: "flex",
    flexDirection: "column",
  },
});

const Comment = ({ postData, reRenderHelper }) => {
  const styleClasses = useStyles();
  const [commentData, setCommentData] = useState([]);
  const [openLikedBy, setOpenLikedBy] = useState(false);
  const [indexOfCollapse, setIndexOfCollapse] = useState(null); 
  const [reRenderLikeHelper, setReRenderLikeHelper] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(
        `authors/${localStorage.getItem("id")}/posts/${
          postData.id.split("posts/")[1]
        }/comments`
      )
      .then((response) => {
        setCommentData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reRenderHelper]);

  const onClickLikeHandler = (index) => {
    let data = {
      type: "like",
      data: commentData[index],
    };
    axiosInstance
      .post(
        `authors/${commentData[index].author.id.split("authors/")[1]}/inbox`,
        data
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
      setReRenderLikeHelper((prevState) => !prevState);
  };

  const handleClickOpenLikedBy = (index) => {
    setIndexOfCollapse(index);
    setOpenLikedBy(true);
  };

  const handleCloseLikedBy = () => {
    setIndexOfCollapse(null);
    setOpenLikedBy(false);
  };
  
  const allComments = commentData.map((data, index) => {
    //data is an object containg all the comments for each post
    return (
      <>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {data.author.displayName}
          </Typography>
          <Typography variant="body2">{data.comment}</Typography>
        </CardContent>

        <CardActions>
          {/* If the user has liked the item : style={{ color: "red" }} */}
          <IconButton
            aria-label="like"
            onClick={() => handleClickOpenLikedBy(index)}
          >
            <FavoriteIcon />
          </IconButton>
        </CardActions>
        <Dialog
          fullScreen
          open={openLikedBy && indexOfCollapse === index}
          unmountOnExit
          timeout="auto"
          aria-label="liked by dialog"
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseLikedBy}
                aria-label="close liked by"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Liked By:
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => onClickLikeHandler(index)}
                aria-label="like"
              >
                {/* If the user has liked the item : style={{ color: "red" }} */}
                <FavoriteIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <CardContent>
            {/* Should list all of the people who have liked the item */}
            <AllCommentLikes commentData={commentData[indexOfCollapse]}  reRenderLikeHelper={reRenderLikeHelper}/>
          </CardContent>
        </Dialog>
      </>
    );
  });

  return (
    <>
      <Box className={styleClasses.allCommentsContainer}>{allComments}</Box>
    </>
  );
};

export default Comment;
