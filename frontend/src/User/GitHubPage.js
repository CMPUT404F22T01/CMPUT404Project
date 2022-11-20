import { Avatar, Card, CardContent } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useActionData } from "react-router-dom";
import PropTypes from 'prop-types';

export default function GitHubPage(props) {
    const {url} = props;

    

  // used to pull github information from github API
  const [gitName, setGithubName] = useState('')
  const [gitProfileImage, setProfileImage] = useState('')
  const [gitRepos, setRepos] = useState('')
  const [gitFollowers, setFollowers] = useState('')
  const [gitFollowing, setGitFollowing] = useState('')
  const [gitStartDate, setStartDate] = useState('')

  const setGitHubData = ({login, followers, following, public_repos, avatar_url, created_at}) => {
      setGithubName(login);
      setProfileImage(avatar_url);
      setRepos(public_repos);
      setGitFollowing(following);
      setFollowers(followers);
      setStartDate(created_at);
  }

    useEffect( () => {
        fetch(url)
          .then(response => response.json())
          .then(data => { setGitHubData(data)})
          .catch( error => { console.log(error)});
    }, []);

    return (
        <Card>
            <CardContent>
            </CardContent>
        </Card>
    );
};
