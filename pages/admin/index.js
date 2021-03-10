import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import styles from "../../styles/admin/Admin.module.css";
import { Close } from "@material-ui/icons";

import game from "../../helpers/game";

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

import { signInWithGoogle } from "../../utils/firebase";
import firebase from "../../utils/firebase";

export default function Admin() {
  const [inputText, setInputText] = useState("");
  const router = useRouter();

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [barMessage, setMessage] = useState("");

  useEffect(async () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && user.email !== null) {
        if (user.email.endsWith("@wafbla.org")) {
          console.log("already logged in, redirecting to dashboard");
          router.replace(`/admin/dashboard`);
        }
      }
    });
  }, []);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  async function passwordCheck() {
    if (await game.checkPd(inputText)) {
      googleSignInPopup();
    }
  }

  function googleSignInPopup() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        var user = result.user;

        if (user.email.endsWith("@wafbla.org")) {
          console.log("wafbla account, all good");
          //redirect to dashboard
          router.replace(`/admin/dashboard`);
        } else {
          console.log("not a wafbla account");
          user
            .delete()
            .then(function () {
              //display message to user that sign in operation/account is deleted
              setOpenSnackBar(true);
              setMessage("Admins must sign in through a WAFBLA account");
            })
            .catch(function (error) {
              // An error happened.
            });
        }
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  }

  return (
    <>
      <div style={{ padding: "10px" }}>
        <Link href="/">
          <Button id={styles.adminButton}>Back to home</Button>
        </Link>
        <Container id={styles.homeContainer} style={{ minHeight: "60vh" }}>
          <Typography variant="h2" id={styles.title} gutterBottom>
            Admin
          </Typography>
          <Card className={styles.gamePinCard}>
            <CardContent className={styles.pinContainer}>
              <TextField
                placeholder="ADMIN PASSWORD"
                type={"password"}
                onChange={(event) => {
                  setInputText(event.target.value);
                }}
                id={styles.pinInput}
                inputProps={{ style: { textAlign: "center" } }}
              />

              <Button
                variant="contained"
                onClick={() => passwordCheck()}
                color="primary"
                id={styles.adminButton}
              >
                Sign in!
              </Button>
            </CardContent>
          </Card>
          {openSnackBar && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={openSnackBar}
              autoHideDuration={6000}
              onClose={handleCloseSnackBar}
              message={barMessage}
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleCloseSnackBar}
                >
                  <Close fontSize="small" />
                </IconButton>
              }
            />
          )}
        </Container>
      </div>
    </>
  );
}
