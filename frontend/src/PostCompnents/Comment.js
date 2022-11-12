import { Box, Typography, CardContent, CardActions, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { makeStyles } from "@mui/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";

const useStyles = makeStyles({
  allCommentsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: 'center'
  },
});

const Comment = ({ postData, reRenderHelper }) => {
  const styleClasses = useStyles();
 
  const [commentData, setCommentData] = useState([]);
  useEffect(() => {
    axiosInstance
      .get(
        `authors/${localStorage.getItem("id")}/posts/${postData.id.split('posts/')[1]}/comments`
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
        <Card sx={{ width: 1000, m: '1rem' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {data.author.displayName}
          </Typography>
          <Typography variant="body2">
            {data.comment}
          </Typography>
        </CardContent>
        
        <CardActions>
          {/* If the user has liked the item : style={{ color: "red" }} */}
          <IconButton aria-label="like">
            <FavoriteIcon />
          </IconButton>
        </CardActions>
        </Card>
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
