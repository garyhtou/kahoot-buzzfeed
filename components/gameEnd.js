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
	const [myGroupInfo, setMyGroupInfo] = useState({});

	// Get my results
	useEffect(async () => {
		try {
			setMyResults(await game.calcMyMatch(pin, uuid));
		} catch (error) {
			// TODO: surface to user
			// most likely user not found
		}
	}, []);

	// Get group info of my results
	useEffect(() => {
		if (typeof myResults !== 'undefined') {
			setMyGroupInfo(game.getGroupInfo(myResults));
		}
	}, [myResults, state]);

	return (
		<Box id={styles.container}>
			<Box id={styles.header}>
				<Box id={styles.matchContainer}>
					<Typography variant='h6'>You matched with</Typography>
					<Typography variant='h3'>{myGroupInfo.name}</Typography>
					<Box id={styles.peopleContainer}>
						{typeof myGroupInfo.members !== 'undefined'
							? myGroupInfo.members.map((p) => (
									<Box id={styles.personWrapper} key={p.name + p.picture}>
										<Tooltip title={`Visit ${p.linkType}`}>
											<Box>
												<Avatar
													src={p.picture}
													alt={p.name}
													id={styles.personAvatar}
												/>
												<Typography variant='body1' id={styles.name}>
													{p.name}
												</Typography>
												<Typography variant='body1' id={styles.social}>
													<Link href={p.link} target='_blank' color='inherit'>
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
					<Typography varient='body1' id={styles.characteristics} style={{marginTop: '1rem'}}>
						{myGroupInfo.characteristics}
					</Typography>
				</Box>
				<Divider />
			</Box>
			{/* <Box id={styles.details}>
				<span>More details coming soon...</span>
			</Box> */}
		</Box>
	);
}

gameEnd.propTypes = {
	pin: PropTypes.number,
	state: PropTypes.string,
	uuid: PropTypes.string,
};
