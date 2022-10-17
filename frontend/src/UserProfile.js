import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './UserProfile.css';

const UserProfile = ( ) => {
     
    return(
        <>
            <Box color="primary" className="box">
                <Avatar height="150px" width="150px">NP</Avatar>
                <h3 className="username add-padding">Display Name</h3>
                <h4 className="user_github add-padding">Github Url</h4>
            </Box> 
        </>
    )
}

export default UserProfile