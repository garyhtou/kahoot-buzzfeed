export default {
	// Overall site name and page title
	siteName: 'Washington FBLA',
	// Admin Sign in with Google email ends with
	adminEmailDomain: 'wafbla.org',
	// Don't touch!
	gameStates: {
		waiting: 'GAME_STATE-WAITING',
		gameQuestionPrefix: 'GAME_STATE-GAME_QUESTION_',
		gameQuestion: function (num) {
			return this.gameQuestionPrefix + num;
		},
		end: 'GAME_STATE-END',
	},
	// Customize the game!
	game: {
		// Name of the game/quiz
		name: 'Which State Officers are you like?',
		// Results
		groups: {
			a: {
				name: 'Group A',
				members: [
					{
						name: 'State Officer 1',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 2',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 3',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 4',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
				],
				characteristics: 'Loves presentation events',
			},
			b: {
				name: 'Group B',
				members: [
					{
						name: 'State Officer 5',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 6',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 7',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 8',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
				],
				characteristics: 'Loves dogs',
			},
			c: {
				name: 'Group C',
				members: [
					{
						name: 'State Officer 9',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 10',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 11',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 12',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
				],
				characteristics: 'Loves cats',
			},
			d: {
				name: 'Group D',
				members: [
					{
						name: 'State Officer 13',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 14',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 15',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
					{
						name: 'State Officer 16',
						picture: 'http://www.gravatar.com/avatar/?d=identicon',
					},
				],
				characteristics: 'Loves 🍍 on 🍕!',
			},
		},
		// In case of tie, set default priority
		tieBreaker: ['d', 'b', 'a', 'c'],
		// Set your questions
		questions: [
			{
				question: 'What type of competitive event do you like?',
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Presentation', belongs: 'a' },
					b: { title: 'Test', belongs: 'b' },
					c: { title: 'Demonstration', belongs: 'c' },
					d: { title: 'Prejudged', belongs: 'd' },
				},
			},
			{
				question: "What's your favorite pet?",
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Dog', belongs: 'a' },
					b: { title: 'Cat', belongs: 'b' },
					c: { title: 'Snake', belongs: 'c' },
					d: { title: 'Hamster', belongs: 'd' },
				},
			},
			{
				question: "What's your favorite fruit?",
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: '🍉', belongs: 'a' },
					b: { title: '🍍', belongs: 'b' },
					c: { title: '🍓', belongs: 'c' },
					d: { title: '🥥', belongs: 'd' },
				},
			},
			{
				question: "What's your favorite breakfast food?",
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: '🥐', belongs: 'a' },
					b: { title: '🍳', belongs: 'b' },
					c: { title: '🥞', belongs: 'c' },
					d: { title: '🧇', belongs: 'd' },
				},
			},
			{
				question: "What's your favorite sport?",
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Swimming', belongs: 'a' },
					b: { title: 'Tennis', belongs: 'b' },
					c: { title: 'Football', belongs: 'c' },
					d: { title: 'Soccer', belongs: 'd' },
				},
			},
			{
				question: 'Pick a color for your math notebook!',
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: '📕', belongs: 'a' },
					b: { title: '📗', belongs: 'b' },
					c: { title: '📘', belongs: 'c' },
					d: { title: '📒', belongs: 'd' },
				},
			},
		],
	},
};
