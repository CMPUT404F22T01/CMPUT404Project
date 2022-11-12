import axios from "axios";
import * as React from "react";
import axiosInstance from "../axiosInstance";

const AllPostLikes = ({postData}) => {

    const [likeData, setLikeData] = React.useState([])

    React.useEffect(() => {
        axiosInstance.get(`authors/${localStorage.getItem("id")}/posts/${postData.id.split("posts/")[1]}/likes`)
        .then((response) => {
            console.log(response.data);
            setLikeData(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }, [])

    const allLikes = likeData.map((value) =>{
        return (
            <>
                <h1>{value.author.username}</h1>
            </>
        )
    })
    return (
        <>
            {allLikes}
        </>
    )
};

export default AllPostLikes;