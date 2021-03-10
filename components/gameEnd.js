import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
	Divider,
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
	const uuid = props.uuid;

	const [myResults, setMyResults] = useState();

	useEffect(() => {
		try {
			setMyResults(game.calcMyMatch(pin, uuid));
		} catch (error) {
			// TODO: surface to user
			// most likely user not found
		}
	}, []);

	return (
		<Box id={styles.container}>
			<Box id={styles.header}>
				<Box id={styles.matchContainer}>
					<Typography variant='h3'>{consts.game.name}</Typography>
					<pre>{JSON.stringify(myResults, null, 2)}</pre>
				</Box>
				<Divider />
			</Box>
			<Box id={styles.details}>
				<span>More details coming soon...</span>
			</Box>
		</Box>
	);
}

gameEnd.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
};
