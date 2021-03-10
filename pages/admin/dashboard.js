import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import styles from "../../styles/admin/Dashboard.module.css";
import game from "../../helpers/game";
import consts from "../../config/consts";

import firebase from "../../utils/firebase";

import { Button, Card, CardContent, Container } from "@material-ui/core";

export default function Dashboard() {
	const [gamesList, setGamesList] = useState([]);
	const [gameClick, setGameClick] = useState(false);
	const [login, setLogin] = useState(false);
	const [gamePin, setGamePin] = useState();

	const router = useRouter();

	//admin went directly to the game dashboard url:

	useEffect(async () => {
		var unsubFuncs = [];

		unsubFuncs.push(
			firebase
				.database()
				.ref(`games`)
				.on("value", (snapshot) => {
					if (snapshot.exists()) {
						setGamesList(snapshot.val());
					} else {
						setGamesList({});
					}
				})
		);

		unsubFuncs.push(
			firebase.auth().onAuthStateChanged(function (user) {
				if (user && user.email !== null) {
					if (game.validAdminEmail(user.email)) {
						console.log("ADMIN LOGIN");
						setLogin(true);
					} else {
						router.replace(`/admin`);
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

	var listOfGames = [];
	for (var k in gamesList) {
		listOfGames.push(k);
	}

	function gameClicked(pin) {
		if (gamesList[pin].state !== consts.gameStates.end) {
			router.replace(`?gamePin=${pin}`);
			setGameClick(true);
			setGamePin(pin);
		} else {
			//show results
			router.replace(`/admin/results?gamePin=${pin}`);
		}
	}

	function dashMain() {
		setGameClick(false);
		setGamePin("");
		router.replace(`/admin/dashboard`);
	}

	function shadowToggle(gamepin, uid) {
		const userSban = gamesList[gamepin].users[uid].sban;
		game
			.getDbRefs(gamepin)
			.user(uid)
			.child("sban")
			.set(userSban !== undefined ? !userSban : true);
	}

	function stateToggle(gamepin, state) {
		if (game.isEnded(state)) {
			setGameClick(false);
			router.replace("/admin/results?gamePin=" + gamepin);
		} else {
			if (game.isWaiting(state)) {
				state = consts.gameStates.gameQuestion(0);
			}
			router.replace("/admin/game?gamePin=" + gamepin);
		}

		firebase
			.database()
			.ref(`games/` + gamepin)
			.child("state")
			.set(state);
	}

	function signOutUser() {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				setLogin(false);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	function newGame() {
		const newPin = Math.floor(Math.random() * (9999 - 1000) + 1000);
		firebase
			.database()
			.ref(`games/` + newPin)
			.child("state")
			.set(consts.gameStates.waiting);
	}

	return (
		<>
			{gameClick ? (
				<div style={{ padding: "10px" }}>
					<Button variant='text' onClick={dashMain}>
						Back to dashboard
					</Button>
					<Container
						id={styles.listContainer}
						style={{ marginTop: "10px", minHeight: "10vh" }}
					>
						<Typography variant='h4' gutterBottom>
							Pin: {gamePin}
						</Typography>
						{console.log()}
						<div style={{ display: "flex", flexDirection: "row" }}>
							<Button
								variant='contained'
								onClick={() => {
									stateToggle(gamePin, gamesList[gamePin].state);
								}}
								color='primary'
								id={styles.enterButton}
							>
								{game.isWaiting(gamesList[gamePin].state)
									? "Start Game"
									: "View Game"}
							</Button>

							<Button
								variant='contained'
								onClick={() => stateToggle(gamePin, consts.gameStates.end)}
								color='primary'
								id={styles.enterButton}
							>
								End game
							</Button>
						</div>

						<Typography variant='h5' style={{ marginTop: "20px" }} gutterBottom>
							{game.isWaiting(gamesList[gamePin].state)
								? "Waiting to start..."
								: game.isInGameQuestions(gamesList[gamePin].state)
								? `Currently on question #${
										game.getQuestionNum(gamesList[gamePin].state) + 1
								  }`
								: game.isEnded(gamesList[gamePin].state)
								? "Game ended"
								: gamesList[gamePin].state}
						</Typography>

						<Card style={{ marginTop: "10px" }}>
							<CardContent id={styles.nameContainer}>
								{gamesList[gamePin].users !== undefined &&
									Object.keys(gamesList[gamePin].users).map(function (uuid) {
										return (
											<div
												key={uuid}
												style={{ display: "flex", flexDirection: "row" }}
											>
												<div
													onClick={() => shadowToggle(gamePin, uuid)}
													style={{
														textDecoration:
															typeof gamesList[gamePin].users[uuid].sban !==
																"undefined" &&
															gamesList[gamePin].users[uuid].sban
																? "line-through"
																: "",
													}}
													className={styles.username}
												>
													{gamesList[gamePin].users[uuid].name}
												</div>
											</div>
										);
									})}
							</CardContent>
						</Card>
					</Container>
				</div>
			) : (
				login && (
					<div style={{ padding: "10px" }}>
						<Typography variant='h3' gutterBottom>
							Hey, {firebase.auth().currentUser.displayName}! <br />
							Welcome to the Admin Dashboard
						</Typography>
						<div
							style={{
								display: "inline-flex",
								flexDirection: "column",
							}}
						>
							<Button
								variant='contained'
								id={styles.newGameButton}
								onClick={() => newGame()}
							>
								Start a new game
							</Button>
							<Button
								onClick={() => signOutUser()}
								id={styles.newGameButton}
								style={{ marginTop: "10px" }}
								variant='contained'
							>
								Sign out
							</Button>
						</div>
						<Container id={styles.listContainer}>
							<Card>
								<CardContent>
									<h2 style={{ margin: "0px" }}>All Games:</h2>
									{listOfGames.map((gamePin) => {
										return (
											<div
												key={gamePin}
												style={{
													marginTop: "10px",
													display: "flex",
													flexDirection: "row",
												}}
											>
												<div
													style={{
														background: game.isEnded(gamesList[gamePin].state)
															? "red"
															: game.isWaiting(gamesList[gamePin].state)
															? "green"
															: "orange",
													}}
													id={styles.gameTitle}
												>
													{gamePin} (
													{game.isWaiting(gamesList[gamePin].state)
														? "waiting"
														: game.isInGameQuestions(gamesList[gamePin].state)
														? `question ${
																game.getQuestionNum(gamesList[gamePin].state) +
																1
														  }/${game.getQuestionNumTotal(gamePin)}`
														: game.isEnded(gamesList[gamePin].state)
														? "ended"
														: gamesList[gamePin].state}
													)
												</div>
												<div
													onClick={() => gameClicked(gamePin)}
													id={styles.viewButton}
												>
													View
												</div>
											</div>
										);
									})}
								</CardContent>
							</Card>
						</Container>
					</div>
				)
			)}
		</>
	);
}
