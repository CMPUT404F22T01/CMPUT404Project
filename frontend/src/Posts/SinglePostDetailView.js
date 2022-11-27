import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import axiosInstance from '../utils/axiosInstance';
import { Typography, Card, Avatar, IconButton, CardMedia, CardContent } from '@mui/material';
import PostCard from './PostCard';

export default function SinglePostDetailView({ post, setPost }) {

    const [data, setData] = React.useState({});

    React.useEffect(()=>{
        // If modal is currently on, then update the data!
        // This extra api call is to make sure we can handle foreign posts.
        if (post && Object.keys(post).length > 0) {
            axiosInstance.get(post.id)
                .then((res)=>setData(res.data))
                .catch((err) => console.error(err));
        } else {
            setData({});
        }; // Else do nothing!
    }, [post]);


    if (data && Object.keys(data).length > 0) 
        return (
            <Dialog
                fullWidth={true}
                maxWidth={"xl"}
                open={true}
                onClose={() => {
                    setPost({});
                }}
            >
                <DialogTitle>Post Shared With You!</DialogTitle>
                <DialogContent>
                
                <PostCard data={data} />

                </DialogContent>
                <DialogActions>
                <Button onClick={() => {
                    setPost({});
                }}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    else return;
}

