import firebase from '../utils/firebase';
import consts from '../config/consts';
import Filter from 'bad-words';
const filter = new Filter();

const additionalNameBlacklist = [];
filter.addWords(...additionalNameBlacklist);

async function validatePin(pin) {
	if (typeof pin === 'undefined' || pin === '') {
		return false;
	}

	const snapshot = await firebase
		.database()
		.ref(`games/${pin}/state`)
		.once('value');

	return snapshot.exists() && snapshot.val() !== consts.gameStates.end;
}

function getDbRefs(pin) {
	return {
		game: firebase.database().ref(`games/${pin}`),
		pin: firebase.database().ref(`games/${pin}/pin`),
		state: firebase.database().ref(`games/${pin}/state`),
		users: firebase.database().ref(`games/${pin}/users`),
		user: (uuid) => firebase.database().ref(`games/${pin}/users/${uuid}`),
		user_name: (uuid) =>
			firebase.database().ref(`games/${pin}/users/${uuid}/name`),
		user_answers: (uuid) =>
			firebase.database().ref(`games/${pin}/users/${uuid}/answers`),
		user_answer: (uuid, question) =>
			firebase.database().ref(`games/${pin}/users/${uuid}/answers/${question}`),
	};
}

async function getName(pin, uid) {
	const snapshot = await firebase
		.database()
		.ref(`games`)
		.child(pin)
		.child('users')
		.child(uid)
		.child('name')
		.once('value');
	return snapshot.val();
}

// State checkers
function isWaiting(state) {
	return state === consts.gameStates.waiting;
}
function isEnded(state) {
	return state === consts.gameStates.end;
}
function isInGameQuestions(state) {
	return getQuestionNum(state) === null ? false : true;
}

function getQuestionNum(state) {
	if (typeof state !== 'string') {
		return null;
	}
	if (
		!isWaiting(state) &&
		!isEnded(state) &&
		state.match(new RegExp(`^${consts.gameStates.gameQuestionPrefix}`))
	) {
		return parseInt(
			state.substring(consts.gameStates.gameQuestionPrefix.length)
		);
	}
	return null;
}
function getQuestionText(num) {
	const questionObj = consts.game.questions[num];
	if (typeof questionObj === 'undefined') {
		throw Error(`Question #${num} doesn't exist in config!`);
	}
	return questionObj.question;
}

/**
 * Calculate the matches for a user of a game
 * This will calculate matches for shadow banned users
 * @param {number} pin
 * @param {uuid} uuid
 */
async function calcMyMatch(pin, uuid) {
	const userRef = getDbRefs(pin).user(uuid);
	const snapshot = await userRef.once('value');

	if (!snapshot.exists()) {
		throw Error(`User ${uuid} not found!`);
	}

	return calcMatch(snapshot.val());
}

/**
 * This does NOT calculate shadow banned users
 * @param {number} pin
 * @param {uuid} excludeUuid
 */
async function calcAllMatchesExceptUser(pin, excludeUuid = null) {
	const usersRef = getDbRefs(pin).users;
	const snapshot = await usersRef.once('value');

	if (!snapshot.exists()) {
		return null; //TODO: error message
	}
	const rawUsers = snapshot.val();

	var users = Object.keys(rawUsers).map((uuid) => {
		const user = rawUsers[uuid];
		return {
			uuid: uuid,
			name: user.name,
			match: calcMatch(user.answers),
		};
	});

	// Filter out a user by uuid
	if (excludeUuid !== null) {
		users.filter((user) => user.uuid !== excludeUuid);
	}
	// Filter out shadow banned users
	users.filter((user) =>
		typeof user.sban !== 'undefined' ? !user.sban : true
	);

	return users;
}
function calcAllMatches(pin) {
	return calcAllMatchesExceptUser(pin);
}

/**
 * [Private]
 * TODO: This function needs work... account for edge case where
 * a player skips a quesiton. We probably need to take in an array
 * or object with index and answer (depends on how firebase returns the data)
 * @param {Array} answers
 */
//the answers child level of a uuid is being passed as 'answers'
function calcMatch(answers) {
	//sets each group to 0
	var tally = {};
	Object.keys(consts.game.groups).forEach((g) => (tally[g] = 0));

	for (var k in answers) {
		const questionIndex = k;
		const userChoice = answers[questionIndex];
		const currentQ = consts.game.questions[questionIndex];

		if (typeof currentQ === 'undefined') {
			//this will throw when a mistake is made in entering the questions in consts - number of questions doesnt match, when there are less questions in the consts than in the database
			console.error(`Question #${questionIndex} is not found!`);
			continue;
		}

		const belongsTo = currentQ.answers[userChoice].belongs;
		if (belongsTo === 'NONE') continue;

		tally[belongsTo]++;
	}

	var highest = Object.keys(tally)[0];
	Object.keys(tally).forEach((g) => {
		if (tally[g] > tally[highest]) {
			highest = g;
		} else if (tally[g] == tally[highest]) {
			//what came first in the array
			if (
				consts.game.tieBreaker.indexOf(g) <
				consts.game.tieBreaker.indexOf(highest)
			) {
				highest = g;
			} else {
				highest = highest;
			}
		}
	});
	return highest;
}

async function chooseAnswer(pin, uuid, question, option) {
	// Check if user is signed in
	const currentUser = firebase.auth().currentUser;
	if (typeof currentUser === 'undefined') {
		throw Error('No anonymous user has been created!');
	}

	// Only allow editing of your own answers
	if (currentUser.uid !== uuid) {
		// TODO: include this rule in firebase rule too
		throw Error("Hey! You can't edit someone else's answers :|");
	}

	// Check to make sure the question and option exists
	if (typeof consts.game.questions[question] === 'undefined') {
		throw Error(`Invalid question number: ${question}`);
	} else if (
		typeof consts.game.questions[question].answers[option] === 'undefined'
	) {
		throw Error(`Invalid answer option (in question #${question}): ${option}`);
	}

	// Make sure this user is playing the game
	if (!(await userExists(pin, uuid))) {
		throw Error(
			`User with UUID ${uuid} is not playing this game (pin: #${pin})`
		);
	}

	return getDbRefs(pin).user_answer(uuid, question).set(option);
}

async function userExists(pin, uuid) {
	const user = await getDbRefs(pin).user(uuid).once('value');
	return user.exists();
}

async function getAllGames() {
	var data;
	const snapshot = await firebase
		.database()
		.ref(`games`)
		.once('value', function (subsnapshot) {
			data = subsnapshot.val();
		});

	return data;
}

/**
 * checks the admin password
 * @param {string} password
 * @returns true if valid. else throw error
 */
async function checkAdminPassword(password) {
	if (typeof password === 'undefined' || password === '') {
		throw Error('Please provide a password');
	}
	if (password.replace(/\/\[\]#\$\./, '').trim() !== password) {
		throw Error('Invalid password');
	}
	const snapshot = await firebase
		.database()
		.ref(`password`)
		.child(password)
		.once('value');

	if (snapshot.exists()) {
		return true;
	} else {
		throw Error('Invalid password');
	}
}

function getQuestionNumTotal() {
	return consts.game.questions.length;
}

async function addCurrentUser(pin, name) {
	const uuid = firebase.auth().currentUser.uid;

	if (!validateName(name)) {
		return;
	}

	return getDbRefs(pin).user(uuid).set({
		name: name,
		sban: false,
	});
}

function validateName(name, realtime = false) {
	if (name.length > 14) {
		throw Error('Your name is too long! Please keep it under 14 characters.');
	}
	if (!realtime && name.length <= 1) {
		throw Error('Hmm... Can you pick a longer name?');
	}

	if (!realtime && filter.clean(name) !== name) {
		throw Error('Hey! Please keep it clean :)');
	}

	return true;
}

/**
 * @param {string} email
 * @returns
 */
function validAdminEmail(email) {
	return (
		typeof email === 'string' && email.endsWith(`@${consts.adminEmailDomain}`)
	);
}

function hasNextQuestion(state) {
	if (isEnded(state)) {
		return false;
	} else if (isWaiting(state)) {
		return questionExists(0);
	} else {
		return questionExists(getQuestionNum(state) + 1);
	}

	function questionExists(num) {
		return typeof consts.game.questions[num] !== 'undefined';
	}
}

function setShadowBan(pin, uuid, sban) {
	getDbRefs(pin).user(uuid).child('sban').set(sbane);
}

function getGroupInfo(group) {
	const data = consts.game.groups[group];

	if (typeof data !== 'undefined') {
		return data;
	} else {
		throw Error(`Hey! This group (${group}) doesn't exist in consts`);
	}
}

export default {
	validatePin,
	checkAdminPassword,
	getDbRefs,
	isWaiting,
	isEnded,
	isInGameQuestions,
	calcAllMatches,
	calcAllMatchesExceptUser,
	calcMyMatch,
	chooseAnswer,
	getQuestionText,
	getQuestionNum,
	getQuestionNumTotal,
	userExists,
	addCurrentUser,
	validateName,
	validAdminEmail,
	hasNextQuestion,
	setShadowBan,
	getGroupInfo,
};
