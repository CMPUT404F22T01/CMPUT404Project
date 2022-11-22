import { Grid, Card, CardContent, CardHeader, CardMedia, Typography, Divider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link, useActionData } from "react-router-dom";
import PropTypes from 'prop-types';
import { Box, margin } from "@mui/system";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import BookIcon from '@mui/icons-material/Book';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

export default function GitHubPage(props) {
    const {url} = props;

    

  // used to pull github information from github API
  const [gitName, setGithubName] = useState('')
  const [gitProfileImage, setProfileImage] = useState('')
  const [gitRepos, setRepos] = useState('')
  const [gitFollowers, setFollowers] = useState('')
  const [gitFollowing, setGitFollowing] = useState('')
  const [gitStartDate, setStartDate] = useState('')
  const [eventData, setEventData] = useState([])

  const setGitHubData = ({login, followers, following, public_repos, avatar_url, created_at}) => {
      setGithubName(login);
      setProfileImage(avatar_url);
      setRepos(public_repos);
      setGitFollowing(following);
      setFollowers(followers);

      let date = new Date(created_at);
      let dateToString = date.toDateString();
      let dateParts = dateToString.split(" ");
      let dateString = dateParts[1] + " " + dateParts[2] + " " + dateParts[3];
      setStartDate(dateString);
  }

    useEffect( () => {
        let gitUsername = url.split('github.com/')[1];
        let apiURL = "https://api.github.com/users/" + gitUsername;
        fetch(apiURL)
          .then(response => response.json())
          .then(data => {setGitHubData(data)})
          .catch( error => { console.log(error)});

        fetch(apiURL + "/events")
            .then(response => response.json())
            .then(data => {setEventData(data)})
            .catch( error => {console.log(error)});
    }, []);

    const allEvents = eventData.map((event, index) => {
        return (
            <Typography>{event.id}</Typography>
        )
    });



    return (
        <>
        <Card sx={{width: 350, margin: 2}} >
            <CardMedia component="img" image={gitProfileImage}/>
            <CardContent> 
                <List>
                    <ListItem>
                        <ListItemText primary={gitName} secondary={ "Joined " + gitStartDate} primaryTypographyProps={{fontSize: 20}}></ListItemText>
                    </ListItem>
                    <Divider component="li"/>
                    <ListItem>
                        <PeopleAltIcon sx={{marginRight: 1}}></PeopleAltIcon>
                        {gitFollowers} Followers
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <PersonIcon sx={{marginRight: 1}}></PersonIcon>
                        {gitFollowing} Following
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <BookIcon sx={{marginRight: 1}}></BookIcon>
                        {gitRepos} Repositories
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                       <LinkIcon sx={{marginRight: 1}}></LinkIcon>
                        <Link href={url} onClick={() => window.open(url)}>github.com/{gitName}</Link>
                    </ListItem>
                </List>

            </CardContent>
            
        </Card>
        {allEvents}
        </>
    );
};
