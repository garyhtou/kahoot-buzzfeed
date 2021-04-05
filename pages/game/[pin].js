import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../styles/Game.module.css';
import consts from '../../config/consts';
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import game from "../../helpers/game";
import GameView from "../../components/gameView";
import firebase from "../../utils/firebase";

export default function Game() {
  const router = useRouter();
  const [loadingPinValidation, setLoadingPinValidation] = useState(true);
  const [gameState, setGameState] = useState("");
  const [name, setName] = useState("");

  const [user, setUser] = useState({});

  // Validate game pin
  useEffect(async () => {
    const pin = getPin();
    if (typeof pin === "undefined") {
      // sometime javascript window is undefined...
      return;
    }
    const result = await game.validatePin(pin);
    if (!result) {
      // if invalid game pin, redirect to home page with error message
      router.replace(`/?invalid_pin=${pin}`);
    } else {
      // if VALID game pin, continue
      setLoadingPinValidation(false);
    }
  }, []);

  // Get game data
  useEffect(() => {
    // Don't attempt to get game data unless pin is validated
    if (loadingPinValidation) {
      return;
    }

    const refs = game.getDbRefs(getPin());
    const unsubFuncs = [];
		// Game state
		unsubFuncs.push(
			refs.state.on('value', (snapshot) => {
				if (snapshot && snapshot.exists()) {
					const newState = snapshot.val();
					setGameState(newState);
					console.log(`GAME STATE: ${newState}`);
				}
			})
		);

    // clean up firebase listener when leaving
    return function () {
      unsubFuncs.forEach((func) => func());
    };
  }, [loadingPinValidation]);

  // anon user
  useEffect(async () => {
    var unsub = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log(`UID: ${user.uid}`);
        setUser(user);
        const val = await game.getName(getPin(), user.uid);
        setName(val);
      }
    });

    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        // successfully signed in
        console.log("ANON USER SUCCESS");
      })
      .catch((error) => {
        console.error(error);
      });

    return unsub;
  }, []);

  return (
    <>
      <Container id={styles.gameContainer}>
        <Head>
          <title>
            {consts.siteName}: {consts.game.name}
          </title>
        </Head>
        <AppBar position="fixed">
          <Toolbar id={styles.toolbar}>
            {game.isWaiting(gameState) ? (
              <Typography variant="h6">{consts.siteName}</Typography>
            ) : (
              <div>
                {" "}
                <Typography variant="h6">{consts.game.name}</Typography>
                <Typography style={{ fontSize: "14px" }}>{name}</Typography>
              </div>
            )}

            {game.isInGameQuestions(gameState) ? (
              <div>
                {" "}
                <Typography style={{ fontSize: "14px" }}>
                  Question {game.getQuestionNum(gameState) + 1}/
                  {game.getQuestionNumTotal()}
                </Typography>
                <Typography style={{ fontSize: "11px" }}>
                  Pin: {getPin()}
                </Typography>
              </div>
            ) : null}
          </Toolbar>
        </AppBar>
        {/* This toolbar is necessary to prevent content being hidden under the real fixed appbar/toolbar */}
        <Toolbar />
        <GameView pin={getPin()} state={gameState} uuid={user.uid} />
      </Container>
    </>
  );
}

function getPin() {
  if (typeof window === "undefined") {
    return undefined;
  }
  const pin = window.location.href.split("/").pop().split("?")[0];
  return isNaN(pin) ? pin : parseInt(pin);
}
