import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/GameView.module.css";
import consts from "../config/consts";
import { Backdrop, Box, CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import game from "../helpers/game";
import GameWaiting from "./gameWaiting";
import GameEnd from "./gameEnd";
import GameQuestion from "./gameQuestion";

export default function GameView(props) {
	const pin = props.pin;
	const state = props.state;

	return (
		<Box id={styles.gameView}>
			{game.isInGameQuestions(state) ? (
				<GameQuestion pin={pin} state={state} />
			) : game.isWaiting(state) ? (
				<GameWaiting pin={pin} state={state} />
			) : game.isEnded(state) ? (
				<GameEnd pin={pin} state={state} />
			) : (
				<Box id={styles.invalidState}>
					<CircularProgress color="inherit" />
				</Box>
			)}
		</Box>
	);
}

GameView.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
};
