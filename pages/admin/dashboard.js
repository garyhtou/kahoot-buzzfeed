import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import styles from "../../styles/GameRow.module.css";
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
  const [arrayState, setArrayState] = useState([]);

  var employees = [
    {
      id: 1,
      firstname: "abc",
      lastname: "xyz",
      phone: "+91 789654123",
      email: "abcyz@gmail.com",
    },
    {
      id: 2,
      firstname: "def",
      lastname: "uvz",
      phone: "+91 123456987",
      email: "defvu@gmail.com",
    },
    {
      id: 2,
      firstname: "def",
      lastname: "uvz",
      phone: "+91 123456987",
      email: "defvu@gmail.com",
    },
  ];

  useEffect(async () => {
    const result = await game.getGameNames();
    setArrayState(result);
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <Container id={styles.listContainer} style={{ minHeight: "60vh" }}>
        <Typography variant="h2" id={styles.title} gutterBottom>
          View all games
        </Typography>
        <Card className={styles.gamePinCard}>
          <CardContent className={styles.pinContainer}>
            {arrayState.map((el) => {
              return (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div id={styles.gameTitle}>{el}</div>
                  <div id={styles.viewButton}>View</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
