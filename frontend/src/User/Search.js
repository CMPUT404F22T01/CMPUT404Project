import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Card, CardContent, Link, Box, Avatar } from "@mui/material";

import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

import isValidUrl from "../utils/urlValidator";

const useStyles = makeStyles({
  container: {
    position: "absolute", 
    top: 50,
    right: 0,
    backgroundColor: 'transparent',
    width: 400,
    zIndex: 10,
  },
  cardContent: {
    display: "flex",
      
    backgroundColor: '#23395d'
  },
  card: {
    backgroundColor: 'red',
    borderRadius: 0,
  }
});

const Search = ({ searchValue }) => {
  const styles = useStyles();
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState([]);
  
    useEffect(() => {
        axiosInstance.get(
            'author/search/', 
            {
                params: {
                    'username': searchValue
                  }
            }
           
        ).then((response) => {
            // console.log(response.data);
            setSearchData(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }, [searchValue])

  const searchResults = searchData.map((authorData, index) => {
     
    return (
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          {authorData.profileImage ?  <Avatar src={isValidUrl(authorData.profileImage) ? authorData.profileImage : `${authorData.host}`+authorData.profileImage.substring(1)}></Avatar>: <Avatar sx={{backgroundColor:"#fcb69f"}}>{authorData.username[0]}</Avatar>}
          
          <Link
            onClick={()=>navigate('/profile', {state:{authorData}})}
            variant="body2"
            sx={{ fontSize: "20px", marginLeft: "10px", color: "white", lineHeight:'40px'}}
          >
            {authorData.username}
          </Link>
        </CardContent>
      </Card>
    );
  });

  return (
    <>
      <Box className={styles.container}>
         {searchResults}
      </Box>
    </>
  );
};

export default Search;
