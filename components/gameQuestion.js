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
	Grid,
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
		<Box id={styles.container}>
			<Typography variant="h3" id={styles.question}>
				{game.getQuestionText(game.getQuestionNum(state))}
			</Typography>
			<Grid container id={styles.options} spacing={2}>
				<Grid item lg>
					<Paper>
						<Typography varient="body1">Option 1</Typography>
					</Paper>
				</Grid>
				<Grid item md>
					<Paper>
						<Typography varient="body1">Option 1</Typography>
					</Paper>
				</Grid>
				<Grid item md>
					<Paper>
						<Typography varient="body1">Option 1</Typography>
					</Paper>
				</Grid>
				<Grid item md>
					<Paper>
						<Typography varient="body1">Option 1</Typography>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}

gameQuestion.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
};
