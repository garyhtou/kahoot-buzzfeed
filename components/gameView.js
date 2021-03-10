import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/GameView.module.css';
import consts from '../config/consts';
import {
	Backdrop,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import game from '../helpers/game';
import GameWaiting from './gameWaiting';
import GameEnd from './gameEnd';
import GameQuestion from './gameQuestion';

export default function GameView(props) {
	const pin = props.pin;
	const state = props.state;
	const uuid = props.uuid;

	const [needSetup, setNeedSetup] = useState(false);
	const [name, setName] = useState('');
	const [nameError, setNameError] = useState(null);

	// check if a user for this game has been created in the db
	useEffect(async () => {
		if (typeof uuid !== 'undefined') {
			if (!(await game.userExists(pin, uuid))) {
				setNeedSetup(true);
			}
		}
	});

	async function closeDialogSetupUser() {
		try {
			if (game.validateName(name)) {
				await game.addCurrentUser(pin, name);
				setNeedSetup(false);
				setNameError(null);
			}
		} catch (error) {
			setNameError(error.message);
		}
	}
	function nameOnChange(e) {
		const value = e.target.value;
		setName(value);

		// real time validation
		try {
			if (game.validateName(value, true)) {
				setNameError(null);
			}
		} catch (error) {
			setNameError(error.message);
		}
	}

	return (
		<Box id={styles.gameView}>
			<Dialog open={needSetup} onClose={closeDialogSetupUser}>
				<DialogTitle>Create a username</DialogTitle>
				<DialogContent>
					<DialogContentText>Please keep it clean!</DialogContentText>
					<TextField
						error={nameError !== null}
						helperText={nameError !== null ? nameError : undefined}
						autoFocus
						id='username'
						label='Username'
						fullWidth
						type='text'
						onChange={nameOnChange.bind(this)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDialogSetupUser} color='secondary'>
						Let's go!
					</Button>
				</DialogActions>
			</Dialog>

			{game.isInGameQuestions(state) ? (
				<GameQuestion pin={pin} state={state} uuid={uuid} />
			) : game.isWaiting(state) ? (
				<GameWaiting pin={pin} state={state} uuid={uuid} />
			) : game.isEnded(state) ? (
				<GameEnd pin={pin} state={state} uuid={uuid} />
			) : (
				<Box id={styles.invalidState}>
					<CircularProgress color='inherit' />
				</Box>
			)}
		</Box>
	);
}

GameView.propTypes = {
	pin: PropTypes.number || PropTypes.string,
	state: PropTypes.string,
	uuid: PropTypes.string,
};
