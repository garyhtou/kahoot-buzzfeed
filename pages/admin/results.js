import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes, { array } from "prop-types";
import styles from "../../styles/admin/Results.module.css";
import game from "../../helpers/game";

import firebase from "../../utils/firebase";

import consts from "../../config/consts";

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
  const [matchData, setMatchData] = useState([]);
  const [gameState, setGameState] = useState("");
  const [login, setLogin] = useState(false);

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
    });
    snapshot.child("users").on("value", (subsnapshot) => {
      data = subsnapshot.val();
      //const val = game.calcMatch(data.uuid.answers);

      setUserData(data);
    });
    const val = await game.calcAllMatches(gamePin);
    setMatchData(val);

    firebase.auth().onAuthStateChanged(function (user) {
      if (user && user.email !== null) {
        if (user.email.endsWith("@wafbla.org")) {
          setLogin(true);
        }
      } else {
        //no user logged in, so go back to admin
        setLogin(false);
        router.replace(`/admin`);
      }
    });
  }, []);

  function getGroup(matchChar) {
    var names = [];
    for (var k in matchData) {
      if (matchData[k].match === matchChar) {
        names.push(matchData[k].name);
      }
    }
    return names;
  }

  function getGroupInfo(val) {
    var officers = [];
    Object.keys(consts.game.groups[val].members).map(function (key) {
      officers.push(
        <h4 style={{ margin: "0px" }}>
          {consts.game.groups[val].members[key].name}
        </h4>
      );
    });
    officers.push(
      <h4 style={{ margin: "0px" }}>
        {consts.game.groups[val].characteristics}
      </h4>
    );
    return officers;
  }

  return (
    <>
      {login && (
        <Container id={styles.question}>
          <Typography variant="h3">Results</Typography>
          <Typography variant="h5">{gameState}</Typography>
          <Typography variant="h5">Game pin: {gamePin}</Typography>

          <Link href="dashboard">
            <Button
              variant="contained"
              color="primary"
              id={styles.resultsButton}
            >
              Back to dashboard
            </Button>
          </Link>
          <Card style={{ marginTop: "20px" }}>
            <CardContent>
              <div
                id={styles.nameContainer}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div id={styles.groupTitle}>
                  {consts.game.groups.a.name}
                  <br /> State officers in this group:
                  {getGroupInfo("a")}
                </div>
                {Object.keys(getGroup("a")).map(function (key) {
                  return (
                    <div
                      key={key}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <div id={styles.name}>{getGroup("a")[key]}</div>
                    </div>
                  );
                })}
              </div>
              <div
                id={styles.nameContainer}
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div id={styles.groupTitle}>
                  {" "}
                  {consts.game.groups.b.name}
                  <br /> State officers in this group:
                  {getGroupInfo("b")}
                </div>
                {Object.keys(getGroup("b")).map(function (key) {
                  return (
                    <div
                      key={key}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <div id={styles.name}>{getGroup("b")[key]}</div>
                    </div>
                  );
                })}
              </div>
              <div
                id={styles.nameContainer}
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div id={styles.groupTitle}>
                  {" "}
                  {consts.game.groups.c.name}
                  <br /> State officers in this group:
                  {getGroupInfo("c")}
                </div>
                {Object.keys(getGroup("c")).map(function (key) {
                  return (
                    <div
                      key={key}
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <div id={styles.name}>{getGroup("c")[key]}</div>
                    </div>
                  );
                })}
              </div>
              <div
                id={styles.nameContainer}
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div id={styles.groupTitle}>
                  {" "}
                  {consts.game.groups.d.name}
                  <br /> State officers in this group:
                  {getGroupInfo("d")}
                </div>

                {Object.keys(getGroup("d")).map(function (key) {
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div id={styles.name}>{getGroup("d")[key]}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </Container>
      )}
    </>
  );
}
