import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/GameQuestion.module.css";
import consts from "../config/consts";
import {
	Box,
	Button,
	ButtonBase,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Grid,
	GridList,
	GridListTile,
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
	const uuid = props.uuid;

	const questionNum = game.getQuestionNum(state);
	const questionObj = consts.game.questions[questionNum];

	function chooseOption(option) {
		game.chooseAnswer(pin, uuid, questionNum, option);
		console.log(`I CHOSE ${option}`);
	}

	return (
		<Box id={styles.container}>
			<Typography variant="h3" id={styles.question}>
				{game.getQuestionText(questionNum)}
			</Typography>
			<GridList id={styles.options} cellHeight="auto" cols={2} spacing={20}>
				{Object.keys(questionObj.answers).map((option, index) => (
					<GridListTile
						key={index}
						rows={
							Object.keys(questionObj.answers).length % 2 !== 0 &&
							index + 1 === Object.keys(questionObj.answers).length
								? 2
								: 1
						}
					>
						<ButtonBase focusRipple={true} className={styles.optionButton}>
							<Paper
								className={styles.optionWapper}
								onClick={() => {
									chooseOption(option);
								}}
							>
								<Typography variant="h4" component="p">
									{questionObj.answers[option].title}
								</Typography>
							</Paper>
						</ButtonBase>
					</GridListTile>
				))}
			</GridList>
		</Box>
	);
}

gameQuestion.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
};
