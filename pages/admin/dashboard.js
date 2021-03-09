import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes, { array } from "prop-types";
import styles from "../../styles/Dashboard.module.css";
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

export default function Dashboard() {
  const [gameArrayState, setGameArrayState] = useState([]);
  const [gameClick, setGameClick] = useState(false);
  const [login, setLogin] = useState(false);
  const [gamePin, setGamePin] = useState();

  const router = useRouter();

  //admin went directly to the game dashboard url:

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

    firebase.auth().onAuthStateChanged(function (user) {
      if (user && user.email.endsWith("@wafbla.org")) {
        console.log("ADMIN LOGIN");
        setLogin(true);
      } else {
        //no user logged in, so go back to admin
        setLogin(false);
        router.replace(`/admin`);
      }
    });
  }, []);

  var listOfGames = [];
  for (var k in gameArrayState) {
    listOfGames.push(k);
  }

  function gameClicked(pin) {
    if (gameArrayState[pin].state !== "GAME_STATE-END") {
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
    //document.getElementById(styles.username).style = 'background: red;';
    game
      .getDbRefs(gamepin)
      .user(uid)
      .child("sban")
      .set(
        gameArrayState[gamepin].users[uid].sban !== undefined
          ? !gameArrayState[gamepin].users[uid].sban
          : true
      );
  }

  function stateToggle(gamepin, state) {
    //document.getElementById(styles.username).style = 'background: red;';
    if (state === "GAME_STATE-END") {
      setGameClick(false);
      router.replace("/admin/results?gamePin=" + gamepin);
    } else {
      if (state === "GAME_STATE-WAITING") {
        state = "GAME_STATE-GAME_QUESTION_0";
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
      .catch((error) => {});
  }

  return (
    <>
      {gameClick ? (
        <div style={{ padding: "10px" }}>
          <Button id={styles.backToDash} onClick={dashMain}>
            Back to dashboard
          </Button>
          <Container id={styles.listContainer} style={{ minHeight: "10vh" }}>
            <Typography variant="h4" gutterBottom>
              Pin: {gamePin}
            </Typography>
            {console.log()}
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button
                variant="contained"
                onClick={() => {
                  stateToggle(gamePin, gameArrayState[gamePin].state);
                }}
                color="primary"
                id={styles.enterButton}
              >
                {gameArrayState[gamePin].state === "GAME_STATE-WAITING"
                  ? "Start Game"
                  : "View Game"}
              </Button>

              <Button
                variant="contained"
                onClick={() => stateToggle(gamePin, "GAME_STATE-END")}
                color="primary"
                id={styles.enterButton}
              >
                End game
              </Button>
            </div>

            <Typography variant="h5" style={{ marginTop: "20px" }} gutterBottom>
              Game state:{" "}
              {gameArrayState[gamePin].state.replace("GAME_STATE-", "")}
            </Typography>

            <Card style={{ marginTop: "10px" }}>
              <CardContent id={styles.nameContainer}>
                {gameArrayState[gamePin].users !== undefined &&
                  Object.keys(gameArrayState[gamePin].users).map(function (
                    key
                  ) {
                    return (
                      <div
                        key={key}
                        style={{ display: "flex", flexDirection: "row" }}
                      >
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
                          className={styles.username}
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
        login && (
          <div style={{ padding: "10px" }}>
            <h1>
              Hey, {firebase.auth().currentUser.displayName}! <br />
              Welcome to the Admin Dashboard
            </h1>
            <Button
              onClick={() => signOutUser()}
              variant="contained"
              id={styles.signOutButton}
            >
              Sign out
            </Button>
            <Container id={styles.listContainer} style={{ minHeight: "60vh" }}>
              <Typography variant="h2" id={styles.title} gutterBottom>
                View all games
              </Typography>
              <Card className={styles.gamePinCard}>
                <CardContent className={styles.pinContainer}>
                  {listOfGames.map((el) => {
                    return (
                      <div
                        key={el}
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
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
        )
      )}
    </>
  );
}
