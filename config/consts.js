export default {
	siteName: "Washington FBLA",
	gameStates: {
		waiting: "GAME_STATE-WAITING",
		gameQuestionPrefix: "GAME_STATE-GAME_QUESTION_",
		gameQuestion: function (question_num) {
			return this.gameQuestionPrefix + question_num;
		},
		end: "GAME_STATE-END",
	},
	game: {
		name: "State Officer",
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
		tieBreaker: ["a", "b"],
		questions: [
			{
				question: "What type of competitive event do you like?",
				answers: [
					{ title: "Presentation", belongs: "a" },
					{ title: "Test", belongs: "b" },
					{ title: "Demonstration", belongs: "c" },
				],
			},
		],
	},
};
