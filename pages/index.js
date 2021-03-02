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

export default function Home() {
	const router = useRouter();
	const invalid_pin = router.query["invalid_pin"];

	// manage state of snack bar
	// used to alert user of invalid game pin
	const [openSnackBar, setOpenSnackBar] = useState(true);
	const handleCloseSnackBar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSnackBar(false);
	};

	return (
		<Container id={styles.homeContainer}>
			<Head>
				<title>{consts.siteName}: Enter the game pin</title>
			</Head>

			{invalid_pin ? (
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
							Invalid game pin: <strong>{invalid_pin}</strong>
						</>
					}
					action={
						<IconButton
							size="small"
							aria-label="close"
							color="inherit"
							onClick={handleCloseSnackBar}
						>
							<Close fontSize="small" />
						</IconButton>
					}
				/>
			) : null}

			<Typography variant="h1" id={styles.title} gutterBottom>
				{consts.siteName}!
			</Typography>
			<Card className={styles.gamePinCard}>
				<CardContent className={styles.pinContainer}>
					<TextField
						placeholder="GAME PIN"
						id={styles.pinInput}
						inputProps={{ style: { textAlign: "center" } }}
					/>
					<Button variant="contained" color="primary" id={styles.enterButton}>
						Enter
					</Button>
				</CardContent>
			</Card>
		</Container>
	);
}
