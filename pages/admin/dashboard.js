import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes, { array } from "prop-types";
import styles from "../../styles/GameRow.module.css";
import game from "../../helpers/game";

import firebase from "../../utils/firebase";
import AdminGameView from "./game";

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

export default function Dashboard() {
  const [gameArrayState, setGameArrayState] = useState([]);
  const [gameClick, setGameClick] = useState(false);
  const [gamePin, setGamePin] = useState();

  const router = useRouter();

  useEffect(async () => {
    var data;
    const snapshot = await firebase
      .database()
      .ref(`games`)
      .on("value", (subsnapshot) => {
        data = subsnapshot.val();
        //console.log(data);
        setGameArrayState(data);
      });
  }, []);

  var listOfGames = [];
  for (var k in gameArrayState) {
    listOfGames.push(k);
  }

  function gameClicked(pin) {
    if (gameArrayState[pin].state !== "GAME_STATE-END") {
      router.replace(`?gamepin=${pin}`);
      setGameClick(true);
      setGamePin(pin);
    } else {
      //show results
      router.replace(`/admin/results?gamepin=${pin}`);
    }
  }

  function dashMain() {
    setGameClick(false);
    setGamePin("");
    router.replace(`/admin/dashboard`);
  }

  function shadowToggle(gamepin, uid) {
    //document.getElementById(styles.username).style = 'background: red;';
    firebase
      .database()
      .ref(`games/` + gamepin + "/users/" + uid)
      .child("sban")
      .set(
        gameArrayState[gamepin].users[uid].sban !== undefined
          ? !gameArrayState[gamepin].users[uid].sban
          : true
      );
  }

  function stateToggle(gamepin, state) {
    //document.getElementById(styles.username).style = 'background: red;';
    if (state === "END") {
      setGameClick(false);
      setGamePin("");
    }
    firebase
      .database()
      .ref(`games/` + gamepin)
      .child("state")
      .set("GAME_STATE-" + state);
  }

  return (
    <>
      {gameClick ? (
        <div>
          <Link href="dashboard">
            <h1 onClick={dashMain}>Back to dashboard</h1>
          </Link>
          <Container id={styles.listContainer} style={{ minHeight: "10vh" }}>
            <Typography variant="h4" gutterBottom>
              Pin: {gamePin}
            </Typography>
            {console.log()}
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Link href={"/admin/game?gamepin=" + gamePin}>
                <Button
                  variant="contained"
                  onClick={() => {
                    gameArrayState[gamePin].state === "GAME_STATE-WAITING" &&
                      stateToggle(gamePin, "QUESTION-1");
                  }}
                  color="primary"
                  id={styles.enterButton}
                >
                  {gameArrayState[gamePin].state === "GAME_STATE-WAITING"
                    ? "Start Game"
                    : "View Game"}
                </Button>
              </Link>

              <Link href="dashboard">
                <Button
                  variant="contained"
                  onClick={() => stateToggle(gamePin, "END")}
                  color="primary"
                  id={styles.enterButton}
                >
                  End game
                </Button>
              </Link>
            </div>

            <Typography variant="h5" style={{ marginTop: "20px" }} gutterBottom>
              Game state:{" "}
              {gameArrayState[gamePin].state.replace("GAME_STATE-", "")}
            </Typography>

            <Card>
              <CardContent id={styles.nameContainer}>
                {gameArrayState[gamePin].users !== undefined &&
                  Object.keys(gameArrayState[gamePin].users).map(function (
                    key
                  ) {
                    return (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div
                          onClick={() => shadowToggle(gamePin, key)}
                          style={{
                            textDecoration:
                              gameArrayState[gamePin].users[key].sban !==
                                undefined &&
                              gameArrayState[gamePin].users[key].sban
                                ? "line-through"
                                : "",
                          }}
                          id={styles.username}
                        >
                          {gameArrayState[gamePin].users[key].name}
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </Container>
        </div>
      ) : (
        <div>
          <h1>Dashboard</h1>
          <Container id={styles.listContainer} style={{ minHeight: "60vh" }}>
            <Typography variant="h2" id={styles.title} gutterBottom>
              View all games
            </Typography>
            <Card className={styles.gamePinCard}>
              <CardContent className={styles.pinContainer}>
                {listOfGames.map((el) => {
                  return (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <div id={styles.gameTitle}>{el}</div>
                      <div
                        onClick={() => gameClicked(el)}
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
      )}
    </>
  );
}
