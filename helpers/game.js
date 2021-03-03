import firebase from "../utils/firebase";
import consts from "../config/consts";

async function validatePin(pin) {
	const snapshot = await firebase
		.database()
		.ref(`games/${pin}/state`)
		.once("value");

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

// State checkers
function isWaiting(state) {
	return state === consts.gameStates.waiting;
}
function isEnded(state) {
	return state === consts.gameStates.end;
}
function isInGameQuestions(state) {
	if (
		!isWaiting(state) &&
		!isEnded(state) &&
		(state || "").match(new RegExp(`^${consts.gameStates.gameQuestionPrefix}`))
	) {
		return state.substring(consts.gameStates.gameQuestionPrefix.length);
	}
	return false;
}

/**
 * Calculate the matches for a user of a game
 * This will calculate matches for shadow banned users
 * @param {number} pin
 * @param {uuid} uuid
 */
async function calcMyMatch(pin, uuid) {
	const userRef = getDbRefs(pin).user(uuid);
	const snapshot = await userRef.once("value");

	if (!snapshot.exists()) {
		throw Error(`User ${uuid} not found!`);
	}

	return calcMatch(snapshot.val());
}

/**
 * This is NOT calculate shadow banned users
 * @param {number} pin
 * @param {uuid} excludeUuid
 */
async function calcAllMatchesExceptUser(pin, excludeUuid = null) {
	const usersRef = getDbRefs(pin).users;
	const snapshot = await usersRef.once("value");

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
		typeof user.sban !== "undefined" ? !user.sban : true
	);

	return users;
}
function calcAllMatches(pin) {
	return calcAllMatchesExceptUser(pin);
}

/**
 * [Private]
 * @param {Array} answers
 */
function calcMatch(answers) {
	var tally = {};
	Object.keys(consts.game.groups).forEach((g) => (tally[g] = 0));

	for (let [i, answer] of answers.entries()) {
		const question = consts.game.questions[i];
		if (typeof question === "undefined") {
			console.error(`Question #${i} is not found!`);
			continue;
		}
		const belongsTo = question.answers[answer].belongs;
		if (typeof tally[belongsTo] === "undefined") {
			console.error(
				`Group #${belongsTo} is not found! Belongs to answer "${answer}" in question "${i}"`
			);
			continue;
		}
		tally[belongsTo]++;
	}
	console.log(tally);

	var highest = Object.keys(tally)[0];
	Object.keys(tally).forEach((g) => {
		if (
			// if higher tally
			tally[g] > tally[highest] ||
			// if tie, use tie breaker
			((tally[g] = tally[highest]) && //
				consts.game.tieBreaker.indexOf(g) <
					consts.game.tieBreaker.indexOf(highest))
		) {
			highest = g;
		}
	});
	return highest;
}

async function chooseAnswer(pin, uuid, question, option) {
	// TODO: CHECK USER PERMISSIONS (don't allow editing someone else's answers)
	// Don't rely  on firebase rules to verify this

	// Check to make sure the question and option exists
	if (typeof consts.game.questions[question] === "undefined") {
		throw Error(`Invalid question number: ${question}`);
	} else if (
		typeof consts.game.questions[question].answers[option] !== "undefined"
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
	const user = await getDbRefs(pin).user(uuid).once("value");
	return user.exists();
}

export default {
	validatePin,
	getDbRefs,
	isWaiting,
	isEnded,
	isInGameQuestions,
	calcAllMatches,
	calcAllMatchesExceptUser,
	calcMyMatch,
	chooseAnswer,
};
