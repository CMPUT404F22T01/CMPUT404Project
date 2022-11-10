import { Box, Typography, Card, CardContent, CardActions, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { makeStyles } from "@mui/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";

const useStyles = makeStyles({
  allCommentsContainer: {
    display: "flex",
    flexDirection: "column",
  },
});

const Comment = ({ postData, reRenderHelper }) => {
  const styleClasses = useStyles();
 
  const [commentData, setCommentData] = useState([]);
  useEffect(() => {
    axiosInstance
      .get(
        `authors/${localStorage.getItem("id")}/posts/${postData.id}/comments`
      )
      .then((response) => {
         
        setCommentData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reRenderHelper]);

  const allComments = commentData.map((data, index) => {
    //data is an object containg all the comments for each post
    return (
      <>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {data.author.displayName}
          </Typography>
          <Typography variant="body2">
            {data.comment}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
        </CardActions>
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
