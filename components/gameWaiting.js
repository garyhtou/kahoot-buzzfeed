import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/GameWaiting.module.css";
import consts from "../config/consts";
import {
	Badge,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Chip,
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
import firebase from "../utils/firebase";

export default function gameWaiting(props) {
	const pin = props.pin;
	const state = props.state;

	const [users, setUsers] = useState([]);

	useEffect(async () => {
		const unsub = game.getDbRefs(pin).users.on("value", (snapshot) => {
			if (!snapshot.exists()) {
				return;
			}

			// process the users (removing answers)
			const rawUsers = snapshot.val();
			const users = Object.keys(rawUsers)
				.map((uuid) => {
					var user = rawUsers[uuid];
					user.answers = undefined;
					return { uuid, ...user };
				})
				// filter shadowbanned users
				.filter((u) => !u.sban);

			setUsers(users);
		});

		return unsub;
	}, []);

	return (
		<Box id={styles.container}>
			<Box id={styles.header}>
				<Box id={styles.stats}>
					<Typography variant="body1">{users.length} Players</Typography>
					<Typography variant="h3">{consts.game.name}</Typography>
					<Typography variant="body1">
						{game.getQuestionNumTotal()} Questions
					</Typography>
				</Box>
				<Divider />
			</Box>
			<Box id={styles.players}>
				{users.map((u) => (
					<Chip
						label={u.name}
						size="medium"
						key={u.uuid}
						className={styles.player}
					/>
				))}
			</Box>
		</Box>
	);
}

gameWaiting.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
};
