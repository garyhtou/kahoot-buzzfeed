import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/GameEnd.module.css';
import consts from '../config/consts';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Divider,
	IconButton,
	Link,
	Paper,
	Snackbar,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import game from '../helpers/game';

export default function gameEnd(props) {
	const pin = props.pin;
	const state = props.state;
	const uuid = props.uuid;

	const [myResults, setMyResults] = useState();
	const [myAllResults, setAllResults] = useState();
	const [usersWithSimilarResults, setUsersWithSimilarResults] = useState();
	const [myGroupInfo, setMyGroupInfo] = useState({});

	// Get my results
	useEffect(async () => {
		try {
			setMyResults(await game.calcMyMatch(pin, uuid));
		} catch (error) {
			// TODO: surface to user
			// most likely user not found
			setMyResults(undefined);
		}
	}, []);

	// Get group info of my results
	useEffect(() => {
		if (typeof myResults !== 'undefined') {
			setMyGroupInfo(game.getGroupInfo(myResults));
		} else {
			setMyGroupInfo(undefined);
		}
	}, [myResults, state]);

	// Get all results
	useEffect(async () => {
		try {
			const allResults = await game.calcAllMatchesExceptUser(pin, uuid);
			setAllResults(allResults);

			if (typeof myResults !== 'undefined') {
				const similar = allResults
					.filter((u) => u.match === myResults)
					.map((u) => u.name);
				setUsersWithSimilarResults(similar);
			}
		} catch (error) {
			console.log(error);
			setAllResults(undefined);
		}
	}, [myResults, state]);

	function formatSimilar() {
		const len = usersWithSimilarResults.length;
		const suffix = ' also match with your group!';

		if (len === 0) {
			return '';
		} else if (len === 1) {
			return usersWithSimilarResults[0] + suffix;
		} else if (len === 2) {
			return (
				usersWithSimilarResults[0] +
				' and ' +
				usersWithSimilarResults[1] +
				suffix
			);
		}

		const limit = Math.min(len, 5);
		return (
			usersWithSimilarResults.slice(0, limit - 1).join(', ') +
			', and ' +
			usersWithSimilarResults.slice(limit, limit + 1) +
			suffix
		);
	}

	return (
		<>
			{typeof myGroupInfo !== 'undefined' ? (
				<Box id={styles.container}>
					<Box id={styles.header}>
						<Box id={styles.matchContainer}>
							<Typography variant='h6'>You matched with</Typography>
							<Typography variant='h4'>{myGroupInfo.name}</Typography>
							<Box id={styles.peopleContainer}>
								{typeof myGroupInfo.members !== 'undefined'
									? myGroupInfo.members.map((p) => (
											<Box id={styles.personWrapper} key={p.name + p.picture}>
												<Tooltip title={`Visit ${p.linkType}`}>
													<Box id={styles.personCol}>
														<Avatar
															src={p.picture}
															alt={p.name}
															id={styles.personAvatar}
														/>
														<Typography variant='body1' id={styles.name}>
															{p.name}
														</Typography>
														<Typography variant='body1' id={styles.social}>
															<Link
																href={p.link}
																target='_blank'
																color='inherit'
															>
																{p.handle}
															</Link>
														</Typography>
													</Box>
												</Tooltip>
											</Box>
									  ))
									: null}
							</Box>
							<Typography variant='h4' id={styles.characteristics}>
								What does this mean?
							</Typography>
							<Typography
								varient='body1'
								id={styles.characteristics}
								style={{ marginTop: '1rem' }}
							>
								{myGroupInfo.characteristics}
							</Typography>
						</Box>
						<Divider />
					</Box>

					<Box id={styles.details}>
						{usersWithSimilarResults ? (
							<Typography style={{ "fontWeight": 600}} variant='body'>{formatSimilar()}</Typography>
						) : null}
					</Box>
				</Box>
			) : (
				<Box id={styles.container}>
					<Typography style={{ textAlign: 'center' }} variant='h4'>
						You have insufficient data to calculate a match
					</Typography>
				</Box>
			)}
		</>
	);
}

gameEnd.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
	uuid: PropTypes.string,
};
