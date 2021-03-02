export default {
	// Overall site name and page title
	siteName: "Washington FBLA",
	// Don't touch!
	gameStates: {
		waiting: "GAME_STATE-WAITING",
		gameQuestionPrefix: "GAME_STATE-GAME_QUESTION_",
		gameQuestion: function (num) {
			return this.gameQuestionPrefix + num;
		},
		end: "GAME_STATE-END",
	},
	// Customize the game!
	game: {
		// Name of the game/quiz
		name: "State Officer",
		// Results
		groups: {
			a: {
				name: "Funny group",
				members: [
					{ name: "State Officer 1", picture: "https://somewhere.com/so1" },
					{ name: "State Officer 1", picture: "https://somewhere.com/so1" },
				],
				characteristics: "filler",
			},
			b: {
				name: "Funnier group",
				members: [
					{ name: "State Officer 1", picture: "https://somewhere.com/so1" },
					{ name: "State Officer 1", picture: "https://somewhere.com/so1" },
				],
				characteristics: "filler",
			},
		},
		// In case of tie, set default priority
		tieBreaker: ["a", "b"],
		// Set your questions
		questions: [
			{
				question: "What type of competitive event do you like?",
				answers: [
					// Each choice must be assigned to a result group!!!
					{ title: "Presentation", belongs: "a" },
					{ title: "Test", belongs: "b" },
					{ title: "Demonstration", belongs: "c" },
				],
			},
		],
	},
};
