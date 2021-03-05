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

export default function AdminResults(props) {
  const [userData, setUserData] = useState([]);
  const [gameState, setGameState] = useState("");

  const router = useRouter();

  const urlParams = new URLSearchParams(window.location.search);
  const gamePin = urlParams.get("gamepin");

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

      <Link href="dashboard">
        <Button variant="contained" color="primary">
          Back to dashboard
        </Button>
      </Link>
      <Card style={{ marginTop: "20px" }}>
        <CardContent></CardContent>
      </Card>
    </Container>
  );
}
