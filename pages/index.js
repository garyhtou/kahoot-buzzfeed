import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Home.module.css";
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
import { Close } from "@material-ui/icons";
import game from "../helpers/game";

export default function Home() {
	const router = useRouter();
	const [invalidPin, setInvalidPin] = useState(router.query["invalid_pin"]);

	// manage state of snack bar
	// used to alert user of invalid game pin
	const [openSnackBar, setOpenSnackBar] = useState(true);
	const handleCloseSnackBar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setInvalidPin(undefined);
		setOpenSnackBar(false);
	};

	const [gamePin, setGamePin] = useState("");
	async function submitPin(pin) {
		console.log(`VALIDATING PIN: ${pin}`);
		if (pin === "") {
			return;
		}
		if (!(await game.validatePin(pin))) {
			// Pin is invalid, show snackbar
			console.log("nope");
			setInvalidPin(pin);
			setOpenSnackBar(true);
		} else {
			// Pin is valid, redirect to game page
			console.log("yup");
			router.push(`/game/${pin}`);
		}
	}

	return (
		<Container id={styles.homeContainer}>
			<Head>
				<title>{consts.siteName}: Enter the game pin</title>
			</Head>

			{invalidPin ? (
				<Snackbar
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					open={openSnackBar}
					autoHideDuration={6000}
					onClose={handleCloseSnackBar}
					message={
						<>
							Invalid game pin: <strong>{invalidPin}</strong>
						</>
					}
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
			) : null}

			<Typography variant='h1' id={styles.title} gutterBottom>
				{consts.siteName}!
			</Typography>
			<Card className={styles.gamePinCard}>
				<CardContent className={styles.pinContainer}>
					<TextField
						placeholder='GAME PIN'
						id={styles.pinInput}
						inputProps={{ style: { textAlign: "center" } }}
						onChange={(e) => {
							const pin = e.target.value;
							setGamePin(pin);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								submitPin(gamePin);
								e.preventDefault();
							}
						}}
					/>
					<Button
						variant='contained'
						color='primary'
						id={styles.enterButton}
						onClick={() => {
							submitPin(gamePin);
						}}
					>
						Enter
					</Button>
				</CardContent>
			</Card>
		</Container>
	);
}
