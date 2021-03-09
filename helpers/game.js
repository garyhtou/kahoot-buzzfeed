import firebase from "../utils/firebase";
import consts from "../config/consts";
import Filter from "bad-words";
const filter = new Filter();

const additionalNameBlacklist = [];
filter.addWords(...additionalNameBlacklist);

async function validatePin(pin) {
	if (typeof pin === "undefined" || pin === "") {
		return false;
	}

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
	return getQuestionNum(state) === null ? false : true;
}

function getQuestionNum(state) {
	if (
		!isWaiting(state) &&
		!isEnded(state) &&
		(state || "").match(new RegExp(`^${consts.gameStates.gameQuestionPrefix}`))
	) {
		return parseInt(
			state.substring(consts.gameStates.gameQuestionPrefix.length)
		);
	}
	return null;
}
function getQuestionText(num) {
	const questionObj = consts.game.questions[num];
	if (typeof questionObj === "undefined") {
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
	const snapshot = await userRef.once("value");

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
 * TODO: This function needs work... account for edge case where
 * a player skips a quesiton. We probably need to take in an array
 * or object with index and answer (depends on how firebase returns the data)
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
	// Check if user is signed in
	const currentUser = firebase.auth().currentUser;
	if (typeof currentUser === "undefined") {
		throw Error("No anonymous user has been created!");
	}

	// Only allow editing of your own answers
	if (currentUser.uid !== uuid) {
		// TODO: include this rule in firebase rule too
		throw Error("Hey! You can't edit someone else's answers :|");
	}

	// Check to make sure the question and option exists
	if (typeof consts.game.questions[question] === "undefined") {
		throw Error(`Invalid question number: ${question}`);
	} else if (
		typeof consts.game.questions[question].answers[option] === "undefined"
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
	if (name.length > 30) {
		throw Error("Your name is too long! Please keep it under 30 characters.");
	}
	if (!realtime && name.length <= 1) {
		throw Error("Hmm... Can you pick a longer name?");
	}

	if (!realtime && filter.clean(name) !== name) {
		throw Error("Hey! Please keep it clean :)");
	}

	return true;
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
	getQuestionText,
	getQuestionNum,
	getQuestionNumTotal,
	userExists,
	addCurrentUser,
	validateName,
};
