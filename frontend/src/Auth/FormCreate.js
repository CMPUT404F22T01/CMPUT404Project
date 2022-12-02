import { useRef, useState } from 'react';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField'; 
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import  { useNavigate } from 'react-router-dom'

import axios from 'axios'
 


const FormCreate = () => {
    const navigate = useNavigate()

    //for getting user input 
    const display_nameRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const re_passwordRef = useRef(null);
    const githubRef = useRef(null);

    // for show password option
    const [showPassword, setShowPassword] = useState(false);

    //for error if any found
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordNotMatchError, setPasswordMatchError] = useState(false);

    //post url
    const url = 'https://c404t3v1.herokuapp.com/register/'

    // for password show on and off handler
    const visibilityOnClick = (e) => {
      setShowPassword(!showPassword);
    }

    // form submit handler
    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(passwordRef.current.value !== re_passwordRef.current.value){
            setPasswordMatchError(true);
        }
        
        else{
          axios.post(url, { 
            'username': usernameRef.current.value,
            'password': passwordRef.current.value,
            'displayName': display_nameRef.current.value,
            'github': githubRef.current.value,
        }).then((response) => {
            console.log(response.data);
            //if successful route to different page
            navigate("../login/")
        }).catch((err) => {
            console.error(err.response.data)
            if (err.response.data.username){
              setUsernameError(err.response.data.username)
            }if(err.response.data.password){
              setPasswordError(err.response.data.password)
            }
        })
        } 
    } 
    
    function Copyright(props) {
      return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
          {'Copyright © '}
          <Link color="inherit" href="https://mui.com/">
            Social Disco
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      );
    }
    
    const theme = createTheme();
    
    
      return (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={onSubmitHandler} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      inputRef={usernameRef}
                    />
                  </Grid>
                  {usernameError ? <Alert severity='error'>{usernameError}</Alert> : ""} 
                  <Grid item xs={12}>
                    <TextField
                       
                      fullWidth
                      id="display_name"
                      label="Display Name"
                      name="display_name"
                      autoComplete="display_name"
                      inputRef={display_nameRef}
                    /> 
                  </Grid>

                  <Grid item xs={12}>
                    <TextField 
                      fullWidth
                      id="github"
                      label="Github Url"
                      name="github"
                      autoComplete="github"
                      inputRef={githubRef}
                    /> 
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type= {showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="new-password"
                      inputRef={passwordRef}
                      InputProps = {{
                        endAdornment:  showPassword ? <Visibility onClick={visibilityOnClick}/> : <VisibilityOff onClick={visibilityOnClick}/>
                      }}
                    >
                    </TextField>
                     
                  </Grid>
                  {passwordError ? <Alert severity='error'>{passwordError}</Alert> : ""} 
                  <Grid item xs={12} >
                    <TextField
                      required
                      fullWidth
                      autoComplete="new-password"
                      name="reenter_password"
                      type= {showPassword ? "text" : "password"}
                      id="reenter_password"
                      label="Re-enter Password" 
                      inputRef={re_passwordRef}
                    />
                  </Grid>
                  {passwordNotMatchError ? <Alert severity='error'>Password not match</Alert> : ""} 
                   
                </Grid>
                 
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="" variant="body2" onClick={() => navigate("../login/")}>
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      );
    
}

     
export default FormCreate