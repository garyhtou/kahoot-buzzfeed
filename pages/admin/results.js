import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import styles from '../../styles/admin/Results.module.css';
import game from '../../helpers/game';

import firebase from '../../utils/firebase';
import consts from '../../config/consts';

import Link from 'next/link';
import { Button, Card, CardContent, Container } from '@material-ui/core';

export default function AdminResults() {
	const [userData, setUserData] = useState([]);
	const [matchData, setMatchData] = useState([]);
	const [gameState, setGameState] = useState('');
	const [login, setLogin] = useState(false);

	const router = useRouter();

	var gamePin = '';
	if (typeof window !== 'undefined') {
		gamePin = window.location.href.split('?gamePin=').pop();
	}

	useEffect(async () => {
		var unsubFuncs = [];

		if (!(await game.getDbRefs(gamePin).game.once('value')).exists()) {
			router.push('/admin/dashboard');
			return;
		}

		unsubFuncs.push(
			game.getDbRefs(gamePin).state.on('value', (snapshot) => {
				setGameState(snapshot.val());
			})
		);

		unsubFuncs.push(
			game.getDbRefs(gamePin).users.on('value', (snapshot) => {
				if (snapshot.exists()) {
					setUserData(snapshot.val());
				} else {
					setUserData({});
				}
			})
		);

		unsubFuncs.push(
			firebase.auth().onAuthStateChanged(function (user) {
				if (user && user.email !== null) {
					if (game.validAdminEmail(user.email)) {
						setLogin(true);
					}
				} else {
					//no user logged in, so go back to admin
					setLogin(false);
					router.replace(`/admin`);
				}
			})
		);

		return () => {
			unsubFuncs.forEach((unsub) => unsub());
		};
	}, []);

	// update matchings whenever user data or the state changes
	useEffect(async () => {
		const results = await game.calcAllMatches(gamePin);
		setMatchData(results !== null ? results : []);
	}, [userData, gameState]);

	function getGroup(group) {
		return matchData.filter((u) => u.match === group).map((u) => u.name);
	}

	function getGroupInfo(val, field) {
		var officers = [];
		Object.keys(consts.game.groups[val].members).map(function (key) {
      if(field === "name"){
        officers.push(
          <h4 style={{ margin: '0px' }}>
            {consts.game.groups[val].members[key].name}
          </h4>
        );
      }else{
        officers.push(
          <img style={{width: '25px', borderRadius: '50%', flex:'0 0 50%'}} src={consts.game.groups[val].members[key].picture} />
        );
      }
		
		});

		return officers;
	}

	return (
		<>
			{login && (
				<Container id={styles.question}>
					<Typography variant='h3'>Results</Typography>
					<Typography variant='h5'>Game pin: {gamePin}</Typography>

					<Link href='dashboard'>
						<Button
							variant='contained'
							color='primary'
							id={styles.resultsButton}
						>
							Back to dashboard
						</Button>
					</Link>
					<Card style={{ marginTop: '20px' }}>
						<CardContent>
							{Object.keys(consts.game.groups).map((group) => (
								<div
									id={styles.nameContainer}
									style={{ display: 'flex', flexDirection: 'row' }}
									key={group}
								>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                  {getGroupInfo(group)}
                  </div>
                
									<div id={styles.groupTitle}>
										{consts.game.groups[group].name}
										<br /> State officers in this group:
										{getGroupInfo(group, "name")}
                    {consts.game.groups[group].characteristics}
									</div>
									{Object.keys(getGroup(group)).map(function (key) {
										return (
											<div
												key={key}
												style={{ display: 'flex', flexDirection: 'row' }}
											>
												<div id={styles.name}>{getGroup(group)[key]}</div>
											</div>
										);
									})}
								</div>
							))}
						</CardContent>
					</Card>
				</Container>
			)}
		</>
	);
}
