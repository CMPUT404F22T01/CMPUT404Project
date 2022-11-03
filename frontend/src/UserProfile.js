import { useState } from 'react';
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
  Typography,
  TextField
} from '@mui/material';
 
import './UserProfile.css'
import axiosInstance from './axiosInstance'

const UserProfile = () => {
     const location = useLocation()
     const [data, setData] = useState(null)
     
    // const url = 'http://127.0.0.1:8000/mainDB/user/data/'
    // const config = {
    //     headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    // };

    axiosInstance.get('data/')
    .then(response => { 
         console.log(response.data)
    }).catch(err => {
        console.log(err)
    })

 
    
    return (
        <>
        <Card className="user-profile-card"> 
            <CardContent> 
                    <Avatar src="https://media.tacdn.com/media/attractions-splice-spp-674x446/09/c3/33/97.jpg"  className="profile-img" sx={{width:100, height:100}}/>
                    <Typography variant="h5" component="h2" className="user-name">
                    {location.state.response.display_name}
                    </Typography>
                    <Typography variant="h6" component="h2" className="user-name">
                    {location.state.response.username}
                    </Typography>
                    <Typography variant="h6" component="h2" className="user-name">
                    {location.state.response.github_url}
                    </Typography>
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
        </>

    );

 
};

export default UserProfile