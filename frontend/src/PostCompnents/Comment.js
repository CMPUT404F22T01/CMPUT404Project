import {
    Box,
    Typography
} from "@mui/material"
import  {useEffect, useState} from "react"
import axiosInstance from '../axiosInstance'
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
     allCommentsContainer: {
        display: 'flex',
        flexDirection: 'column',
         
     }
  });
  
const Comment = ({postData}) => { 

    const styleClasses = useStyles()

    const [commentData, setCommentData] = useState([])
    useEffect(() => {
        axiosInstance.get(`authors/${localStorage.getItem('id')}/posts/${postData.id}/comments`)
        .then((response) => {
            setCommentData(response.data)
        }).catch((error) => {
            console.error(error)
        }) 
    }, [])

    const allComments = commentData.map((data, index) => {
        //data is an object containg all the comments for each post
        return (
            <Typography variant="p" sx={{p: '10px 10px'}}>{data.comment}</Typography>
        )
    })

    return(
        <>
        <Box className={styleClasses.allCommentsContainer}> 
            {allComments}
        </Box>
        </>
    )
}

export default Comment;