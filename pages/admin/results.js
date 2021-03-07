import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes, { array } from "prop-types";
import styles from "../../styles/Results.module.css";
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

export default function AdminResults(props) {
  const [userData, setUserData] = useState([]);
  const [gameState, setGameState] = useState("");

  const router = useRouter();

  const urlParams = new URLSearchParams(window.location.search);
  const gamePin = urlParams.get("gamePin");

  useEffect(async () => {
    var data;
    const snapshot = await firebase.database().ref(`games/` + gamePin);
    snapshot.child("state").on("value", (stateSnap) => {
      setGameState(stateSnap.val());
    });
    snapshot.child("users").on("value", (subsnapshot) => {
      data = subsnapshot.val();
      setUserData(data);
    });
  }, []);

  return (
    <Container id={styles.question}>
      <Typography variant="h3">Results</Typography>
      <Typography variant="h4">{gameState}</Typography>
      <Typography variant="h4">Game pin: {gamePin}</Typography>

      <Link href="dashboard">
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Back to dashboard
        </Button>
      </Link>
      <Card style={{ marginTop: "20px" }}>
        <CardContent id={styles.nameContainer}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div id={styles.groupTitle}>Group A:</div>
            <div id={styles.name}>hello</div>
            <div id={styles.name}>hello</div>
            <div id={styles.name}>hello</div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div id={styles.groupTitle}>Group A:</div>
            <div id={styles.name}>hello</div>
            <div id={styles.name}>hello</div>
            <div id={styles.name}>hello</div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div id={styles.groupTitle}>Group A:</div>
            <div id={styles.name}>hello</div>
            <div id={styles.name}>hello</div>
            <div id={styles.name}>hello</div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div id={styles.groupTitle}>Group A:</div>
            <div id={styles.name}>hello</div>
            <div id={styles.name}>hello</div>
            <div id={styles.name}>hello</div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
