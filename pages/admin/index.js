import { useRouter } from "next/router";
import { useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import styles from "../../styles/Home.module.css";
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
  const [isLogin, setLogin] = useState(false);
  const [barMessage, setMessage] = useState("");

  const loginState = router.query["login"];

  if (firebase.apps.length === 0) {
    console.log("not initialized in index");
  } else {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        router.replace(`/admin/dashboard`);
        setLogin(true);
      } else {
        //no user logged in, so go back to admin
      }
    });
  }

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  function passwordCheck() {
    if (inputText === "temp") {
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
        var token = credential.accessToken;
        var user = result.user;
        if (user.email.endsWith("@wafbla.org")) {
          router.replace(`/admin/dashboard`);
        } else {
          setOpenSnackBar(true);
          setMessage("admins must sign in through their wafbla account");
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
      {isLogin == false && (
        <div>
          <Link href="/">
            <a>Back to home</a>
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
                  id={styles.enterButton}
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
      )}
    </>
  );
}
