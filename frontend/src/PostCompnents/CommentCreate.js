import {
    Box,
    Typography
} from "@mui/material"
import  {useEffect, useState} from "react"
import axiosInstance from '../axiosInstance'

const Comment = ({postData}) => { 

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
        <Box>
            <Typography variant="p">{data.comment}</Typography>
        </Box>
        )
    })

    return(
        <>
            {allComments}
        </>
    )
}

export default Comment;