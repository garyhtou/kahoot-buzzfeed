import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/GameEnd.module.css";
import consts from "../config/consts";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	IconButton,
	Paper,
	Snackbar,
	TextField,
	Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import game from "../helpers/game";

export default function gameEnd(props) {
	const pin = props.pin;
	const state = props.state;

	return <Typography variant='h3'>RESULTS</Typography>;
}

gameEnd.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
	uuid: PropTypes.string,
};
