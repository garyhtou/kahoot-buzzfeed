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
		user: (uuid) => firebase.database().ref(`games/${pin}/${uuid}`),
		user_name: (uuid) => firebase.database().ref(`games/${pin}/${uuid}/name`),
		user_answer: (uuid, question) =>
			firebase.database().ref(`games/${pin}/${uuid}/answers/${question}`),
	};
}

function getQuestionNum(state) {
	if (state.matches(new RegExp(`^${consts.gameStates.gameQuestionPrefix}`))) {
		return state.substring(consts.gameStates.gameQuestionPrefix.length);
	}
	return null;
}
function isWaiting(state) {
	return state === consts.gameStates.waiting;
}
function isEnded(state) {
	return state === consts.gameStates.end;
}

async function calcMyMatch(pin, uuid) {
	const usersRef = getDbRefs(pin).users;
	const snapshot = usersRef.on("value");

	if (!snapshot.exists()) {
		return; //TODO: error message
	}
	// TODO: Calculate
}

function calcAllMatches(pin) {
	// TODO
}

export default { validatePin, getDbRefs, getQuestionNum, isWaiting, isEnded };
