import { useRouter } from "next/router";
import { useState } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import styles from "../../styles/Home.module.css";
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

//HANDLE ADMIN LOGIN
//console.log("OVERH HERE");
//console.log(refs);

export default function Admin() {
  return (
    <>
      <Link href="/">
        <a>Back to home</a>
      </Link>
      <Container id={styles.homeContainer} style={{ minHeight: "60vh" }}>
        <Card className={styles.gamePinCard}>
          <CardContent className={styles.pinContainer}>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={signInWithGoogle}
              id={styles.enterButton}
            >
              Google auth login
            </Button> */}

            <Link href="dashboard">
              <Button
                variant="contained"
                color="primary"
                id={styles.enterButton}
              >
                dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
