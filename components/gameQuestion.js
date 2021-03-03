import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/GameQuestion.module.css";
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

export default function gameQuestion(props) {
	const pin = props.pin;
	const state = props.state;

	return (
		<Typography variant="h3" id={styles.question}>
			QUESTION HERE
		</Typography>
	);
}

gameQuestion.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
};
