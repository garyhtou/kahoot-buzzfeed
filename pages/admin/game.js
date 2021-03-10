import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import styles from '../../styles//admin/Question.module.css';
import game from '../../helpers/game';

import consts from '../../config/consts';

import firebase from '../../utils/firebase';

import Link from 'next/link';
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
} from '@material-ui/core';

export default function AdminGameView() {
	const [userData, setUserData] = useState([]);
	const [isLogin, setLogin] = useState(false);
	const [playerCount, setPlayerCount] = useState(0);
	const [gameState, setGameState] = useState('');
	const [questionExists, setQuestionExists] = useState(true);

	const [currentQNum, setCurrentQNum] = useState(0);
	const router = useRouter();

	var gamePin = '';
	if (typeof window !== 'undefined') {
		gamePin = window.location.href.split('?gamePin=').pop();
	}

	useEffect(async () => {
		var unsubFuncs = [];
		const gameStateRef = game.getDbRefs(gamePin).game.child('state');

		unsubFuncs.push(
			gameStateRef.on('value', (stateSnapshot) => {
				var qNum = game.getQuestionNum(stateSnapshot.val());

				if (consts.game.questions[qNum] === undefined) {
					gameStateRef.set(consts.gameStates.end);
					setGameState(consts.gameStates.end);
					setQuestionExists(false);
				} else {
					setGameState(stateSnapshot.val());
					setCurrentQNum(qNum);
				}
			})
		);

		unsubFuncs.push(
			game.getDbRefs(gamePin).users.on('value', (snapshot) => {
				if (snapshot.exists()) {
					setUserData(snapshot.val());
					setPlayerCount(snapshot.numChildren());
				}
			})
		);

		unsubFuncs.push(
			firebase.auth().onAuthStateChanged(function (user) {
				if (user && user.email !== null) {
					if (game.validAdminEmail(user.email)) {
						setLogin(true);
					}
				} else {
					//no user logged in, so go back to admin
					setLogin(false);
					router.replace(`/admin`);
				}
			})
		);

		return () => {
			unsubFuncs.forEach((unsub) => unsub());
		};
	}, []);

	function getAnswerCount(questionNum) {
		var count = 0;
		for (var uuid in userData) {
			if (
				userData[uuid].answers !== undefined &&
				userData[uuid].answers[questionNum] !== undefined
			) {
				count++;
			}
		}
		return count;
	}

	/**
	 * Move onto the next question
	 * @param {string} currentState
	 */
	function moveOn(currentState) {
		if (game.hasNextQuestion(currentState)) {
			const nextQ = game.getQuestionNum(currentState) + 1;
			game.getDbRefs(gamePin).state.set(consts.gameStates.gameQuestion(nextQ));
			return;
		}

		game.getDbRefs(gamePin).state.set(consts.gameStates.end);
	}

	function shadowToggle(pin, uid) {
		game.setShadowBan(
			pin,
			uid,
			userData[uid].sban !== undefined ? !userData[uid].sban : true
		);
	}

	if (game.isEnded(gameState)) {
		router.replace(`/admin/results?gamePin=${gamePin}`);
	}

	return (
		<>
			{isLogin && questionExists && (
				<Container id={styles.question}>
					<Typography variant='h3'>
						Question {game.getQuestionNum(gameState) + 1}
					</Typography>
					<Typography variant='body1'>Game Pin: {gamePin}</Typography>
					<Link href='dashboard'>
						<Button variant='contained' id={styles.gameButton}>
							Back to dashboard
						</Button>
					</Link>
					<Card style={{ marginTop: '20px' }}>
						<CardContent>
							<Typography variant='h3'>
								{game.getQuestionText(currentQNum)}
							</Typography>
							<Typography style={{ marginTop: '10px' }} id='ratio' variant='h5'>
								Responses: {getAnswerCount(currentQNum)} / {playerCount}
							</Typography>
							<Button
								variant='contained'
								color='primary'
								onClick={() => moveOn(gameState)}
								id={styles.gameButton}
							>
								{game.hasNextQuestion(gameState)
									? 'Next question'
									: 'Show the results!'}
							</Button>
						</CardContent>
					</Card>

					<div id={styles.nameContainer}>
						{Object.keys(userData).map(function (key) {
							return (
								<div
									onClick={() => shadowToggle(gamePin, key)}
									key={key}
									style={{
										textDecoration:
											userData[key].sban !== undefined && userData[key].sban
												? 'line-through'
												: '',
									}}
									id={styles.username}
								>
									{userData[key].name}
								</div>
							);
						})}
					</div>
				</Container>
			)}
		</>
	);
}
