import { Avatar, Card, CardContent } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useActionData } from "react-router-dom";
import PropTypes from 'prop-types';

export default function GitHubPage(props) {
    const {url, name, repos, imageURL, followers, following, dateJoined} = props;

    return (
        <Card>
            <CardContent>
                {repos}
            </CardContent>
        </Card>
    );
};
