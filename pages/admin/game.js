import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes, { array } from "prop-types";
import styles from "../../styles/GameQuestion.module.css";
import game from "../../helpers/game";

import firebase from "../../utils/firebase";

import Link from "next/link";
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
} from "@material-ui/core";

export default function AdminGameView(props) {
  const [userData, setUserData] = useState([]);
  const [isLogin, setLogin] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [gameState, setGameState] = useState("");
  const [currentQNum, setCurrentQNum] = useState(0);
  const router = useRouter();

  var gamePin = "";
  if (typeof window !== "undefined") {
    gamePin = window.location.href.split("?gamePin=").pop();
  }

  useEffect(async () => {
    var data;
    const snapshot = await firebase.database().ref(`games/` + gamePin);
    snapshot.child("state").on("value", (stateSnap) => {
      setGameState(stateSnap.val());
      var x = Number(stateSnap.val().replace("GAME_STATE-GAME_QUESTION_", ""));
      setCurrentQNum(x);
    });
    snapshot.child("users").on("value", (subsnapshot) => {
      data = subsnapshot.val();
      setUserData(data);
      setPlayerCount(subsnapshot.numChildren());
    });

    firebase.auth().onAuthStateChanged(function (user) {
      if (user && user.email.endsWith("@wafbla.org")) {
        setLogin(true);
      } else {
        //no user logged in, so go back to admin
        setLogin(false);
        router.replace(`/admin`);
      }
    });
  }, []);

  //move on to next question

  function updateAnswerCount(questionNum) {
    var count = 0;
    for (var k in userData) {
      if (
        userData[k].answers !== undefined &&
        userData[k].answers[questionNum] !== undefined
      ) {
        count++;
      }
    }
    return count;
  }

  function moveOn(currentQ) {
    firebase
      .database()
      .ref(`games/` + gamePin)
      .child("state")
      .set("GAME_STATE-GAME_QUESTION_" + (currentQ + 1));
  }

  function shadowToggle(gamepin, uid) {
    //document.getElementById(styles.username).style = 'background: red;';
    game
      .getDbRefs(gamepin)
      .user(uid)
      .child("sban")
      .set(userData[uid].sban !== undefined ? !userData[uid].sban : true);
  }

  if (gameState === "GAME_STATE-END") {
    router.replace(`/admin/results?gamePin=${gamePin}`);
  }

  return (
    <>
      {isLogin && (
        <Container id={styles.question}>
          <Typography variant="h3">
            {gameState.replace("GAME_STATE-", "")}
          </Typography>
          <Typography variant="h3">Pin: {gamePin}</Typography>
          <Link href="dashboard">
            <Button variant="contained" color="primary">
              Back to dashboard
            </Button>
          </Link>
          <Card style={{ marginTop: "20px" }}>
            <CardContent>
              <Typography variant="h3">
                what is your favorite competitive event?
              </Typography>
              <Typography style={{ marginTop: "10px" }} id="ratio" variant="h4">
                {updateAnswerCount(currentQNum - 1)} / {playerCount}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => moveOn(currentQNum)}
                id={styles.adminMoveOn}
              >
                Next question
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
                        ? "line-through"
                        : "",
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
