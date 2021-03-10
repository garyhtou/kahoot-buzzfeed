import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import styles from "../../styles/admin/Admin.module.css";
import { Close } from "@material-ui/icons";

import game from "../../helpers/game";
import consts from "../../config/consts";

import Link from "next/link";
import {
	Button,
	Card,
	CardContent,
	Container,
	IconButton,
	Snackbar,
	TextField,
} from "@material-ui/core";

import firebase from "../../utils/firebase";

export default function Admin() {
	const [inputText, setInputText] = useState("");
	const router = useRouter();

	const [openSnackBar, setOpenSnackBar] = useState(false);
	const [barMessage, setBarMessage] = useState("");

	useEffect(() => {
		const unsub = firebase.auth().onAuthStateChanged(function (user) {
			// if logged in
			if (user && user.email !== null) {
				// if email is eligible to be an admin
				if (game.validAdminEmail(user.email)) {
					console.log("already logged in, redirecting to dashboard");
					router.replace(`/admin/dashboard`);
				}
			}
		});

		return unsub;
	}, []);

	const handleCloseSnackBar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSnackBar(false);
	};

	async function passwordCheck() {
		try {
			if (await game.checkAdminPassword(inputText)) {
				googleSignInPopup();
				setBarMessage(
					`Welcome, please select your ${consts.adminEmailDomain} email.`
				);
				setOpenSnackBar(true);
				setInputText("");
			}
		} catch (error) {
			setBarMessage(error.message);
			setOpenSnackBar(true);
		}
	}

	function googleSignInPopup() {
		const provider = new firebase.auth.GoogleAuthProvider();

		firebase
			.auth()
			.signInWithPopup(provider)
			.then((result) => {
				const credential = result.credential;
				const user = result.user;

				if (game.validAdminEmail(user.email)) {
					console.log("admin account, all good");
					//redirect to dashboard
					router.replace(`/admin/dashboard`);
				} else {
					console.log("not an admin account");
					user
						.delete()
						.then(function () {
							//display message to user that sign in operation/account is deleted
							setOpenSnackBar(true);
							setBarMessage(
								"Admins must sign in through their organization account"
							);
						})
						.catch(function (error) {
							console.error(error);
							// An error happened.
						});
				}
			})
			.catch((error) => {
				console.error(error);
				var errorCode = error.code;
				var errorMessage = error.message;
				var email = error.email;
				var credential = error.credential;
			});
	}

	return (
		<>
			<div style={{ padding: "10px" }}>
				<Link href='/'>
					<Button variant='text'>Back to home</Button>
				</Link>
				<Container id={styles.homeContainer} style={{ minHeight: "60vh" }}>
					<Typography variant='h2' id={styles.title} gutterBottom>
						Admin Dashboard
					</Typography>
					<Card className={styles.gamePinCard}>
						<CardContent className={styles.pinContainer}>
							<TextField
								placeholder='ADMIN PASSWORD'
								type={"password"}
								onChange={(event) => {
									setInputText(event.target.value);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										passwordCheck();
										e.preventDefault();
									}
								}}
								value={inputText}
								id={styles.pinInput}
								inputProps={{ style: { textAlign: "center" } }}
							/>

							<Button
								variant='contained'
								onClick={() => passwordCheck()}
								color='primary'
								id={styles.adminButton}
							>
								Sign in
							</Button>
						</CardContent>
					</Card>
					{openSnackBar && (
						<Snackbar
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							open={openSnackBar}
							autoHideDuration={6000}
							onClose={handleCloseSnackBar}
							message={barMessage}
							action={
								<IconButton
									size='small'
									aria-label='close'
									color='inherit'
									onClick={handleCloseSnackBar}
								>
									<Close fontSize='small' />
								</IconButton>
							}
						/>
					)}
				</Container>
			</div>
		</>
	);
}
