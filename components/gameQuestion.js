import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
import firebase from "../utils/firebase";

export default function gameQuestion(props) {
  const pin = props.pin;
  const state = props.state;
  const uuid = props.uuid;

  const questionNum = game.getQuestionNum(state);
  const questionObj = consts.game.questions[questionNum];
  const [chosenAnswer, setChosenAnswer] = useState(null);

  function chooseOption(option) {
    game.chooseAnswer(pin, uuid, questionNum, option);
    setChosenAnswer(option);
    setAnsweredQuestion(true);
    console.log(`I CHOSE ${option}`);
  }

  // whether this question has been answered
  const [answeredQuestion, setAnsweredQuestion] = useState(false);
  useEffect(() => {
    const unsub = game
      .getDbRefs(pin)
      .user_answer(uuid, questionNum)
      .on("value", (snapshot) => {
        if (typeof snapshot === "undefined") {
          return;
        }
        const answered = snapshot.exists();
        console.log(answered);
        setAnsweredQuestion(answered);
        if (answered) {
          setChosenAnswer(snapshot.val());
        } else {
          setChosenAnswer(null);
        }
      });
    return unsub;
  }, [questionNum]);

  return (
    <Box id={styles.container}>
      <Typography variant="h3" id={styles.question}>
        {game.getQuestionText(questionNum)}
      </Typography>
      <GridList id={styles.options} cellHeight="auto" cols={2} spacing={20}>
        {Object.keys(questionObj.answers).map((option, index) => (
          <GridListTile
            key={questionNum + option}
            rows={
              Object.keys(questionObj.answers).length % 2 !== 0 &&
              index + 1 === Object.keys(questionObj.answers).length
                ? 2
                : 1
            }
          >
            <ButtonBase
              focusRipple={true}
              className={styles.optionButton}
              onClick={() => {
                chooseOption(option);
              }}
              disabled={answeredQuestion}
            >
              <Paper
                className={styles.optionWapper}
                style={{
                  transition: "background .5s",
                  background: chosenAnswer === option && "white",
                }}
                elevation={chosenAnswer === option ? 24 : 1}
              >
                <Typography
                  variant="h4"
                  component="p"
                  color={chosenAnswer === option ? "secondary" : undefined}
                >
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
  uuid: PropTypes.string,
};
