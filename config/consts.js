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
						name: 'Abby Sanders',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Abby-Sanders-Puget-Sound-VP.jpg',
						handle: '@a_sanderswindu',
						link: 'https://instagram.com/a_sanderswindu',
						linkType: 'Instagram',
					},
					{
						name: 'Emily Ney',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Emily-Ney-NW-VP.jpg',
						handle: '@emilyia.n',
						link: 'https://instagram.com/emilyia.n',
						linkType: 'Instagram',
					},
					{
						name: 'Gary Tou',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Gary-Tou-West-Central-VP.jpg',
						handle: '@garyhtou',
						link: 'https://instagram.com/garyhtou',
						linkType: 'Instagram',
					},
					{
						name: 'Haneol Lee',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Haneol-Lee-Final.jpg',
						handle: '@haneoljohn_lee',
						link: 'https://instagram.com/haneoljohn_lee',
						linkType: 'Instagram',
					},
				],
				characteristics: 'Loves presentation events',
			},
			b: {
				name: 'Group B',
				members: [
					{
						name: 'Jean Lin',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Jean-Lin-SW-VP.jpg',
						handle: '@jean_linnn',
						link: 'https://instagram.com/jean_linnn',
						linkType: 'Instagram',
					},
					{
						name: 'Kianna Bolante',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Kianna-Bolante-Parliamentarian.jpg',
						handle: '@kiannabolante',
						link: 'https://instagram.com/kiannabolante',
						linkType: 'Instagram',
					},
					
					{
						name: 'Michael Schwamborn',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Michael-Schwamborn-Public-Relations-Officer.jpg',
						handle: '@michael.schwam',
						link: 'https://instagram.com/michael.schwam',
						linkType: 'Instagram',
					},{},
				],
				characteristics: 'Loves dogs',
			},
			c: {
				name: 'Group C',
				members: [
					{
						name: 'Sathvik Nallamalli',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Sathvik-Nallamalli-President.jpg',
						handle: '@sathvik.nallamalli',
						link: 'https://instagram.com/sathvik.nallamalli',
						linkType: 'Instagram',
					},
					{
						name: 'Smriti Somasundaram',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Smriti-Somasundaram-Capital-VP.jpg',
						handle: '@smritis17',
						link: 'https://instagram.com/smritis17',
						linkType: 'Instagram',
					},
					{
						name: 'Steven Johnson',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Steven-Johnson-NE-Region-VP.jpg',
						handle: '@stevenj448',
						link: 'https://instagram.com/stevenj448',
						linkType: 'Instagram',
					},
					{},
				],
				characteristics: 'Loves cats',
			},
			d: {
				name: 'Group D',
				members: [
					{
						name: 'Tina Zhang',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Tina-Zhang-State-Secretary.jpg',
						handle: '@tinaz0401',
						link: 'https://instagram.com/tinaz0401',
						linkType: 'Instagram',
					},
					{
						name: 'Kody Richards',
						picture: 'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Kody-Richards-North-Central-Region-VP.jpg',
						handle: '@kody.richards',
						link: 'https://instagram.com/kody.richards',
						linkType: 'Instagram',
					},
					{},{}
					
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
