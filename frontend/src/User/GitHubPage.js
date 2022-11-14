import { Avatar, Card, CardContent } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useActionData } from "react-router-dom";
import PropTypes from 'prop-types';

export default function GitHubPage(props) {
    const {repos} = props;

    return (
        <Card>
            <CardContent>
                {repos}
            </CardContent>
        </Card>
    );
};
