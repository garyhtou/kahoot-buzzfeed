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
				name: 'Dependable & Kind',
				members: [
					{
						name: 'Kianna Bolante',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Kianna-Bolante-Parliamentarian.jpg',
						handle: '@kiannabolante',
						link: 'https://instagram.com/kiannabolante',
						linkType: 'Instagram',
					},
					{
						name: 'Abby Sanders',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Abby-Sanders-Puget-Sound-VP.jpg',
						handle: '@a_sanderswindu',
						link: 'https://instagram.com/a_sanderswindu',
						linkType: 'Instagram',
					},
					{
						name: 'Michael Schwamborn',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Michael-Schwamborn-Public-Relations-Officer.jpg',
						handle: '@michael.schwam',
						link: 'https://instagram.com/michael.schwam',
						linkType: 'Instagram',
					},
				],
				characteristics:
					'You are dependable for anything! Also known as the glue of the team, you help support everyone. Like Kianna, Abby and Michael, your amiable personality creates a relaxed environment and you wouldn’t kill a fly. You are always down to help others, and have a hard time saying no when people ask you to do something. In FBLA, you are sometimes the “mom” of your team. You reach out to others when you know they are stressed. Your kindness and smile makes you a great leader that all personality types are inclined to work with.',
			},
			b: {
				name: 'Problem Solver & Techy',
				members: [
					{
						name: 'Gary Tou',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Gary-Tou-West-Central-VP.jpg',
						handle: '@garyhtou',
						link: 'https://instagram.com/garyhtou',
						linkType: 'Instagram',
					},
					{
						name: 'Sathvik Nallamalli',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Sathvik-Nallamalli-President.jpg',
						handle: '@sathvik.nallamalli',
						link: 'https://instagram.com/sathvik.nallamalli',
						linkType: 'Instagram',
					},
					{
						name: 'Emily Ney',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Emily-Ney-NW-VP.jpg',
						handle: '@emilyia.n',
						link: 'https://instagram.com/emilyia.n',
						linkType: 'Instagram',
					},
				],
				characteristics:
					'You are analytical, creative and great with technology! Anything from organization to communication, to finding quick solutions, you’ve got it covered. Your problem solving skills help you get straight to the root of the issue. Your brilliant mind helps teams brainstorm and quickly fix any problem. Like Sathvik, you can apply your skill set to a wide variety of places. Like Gary and Emily, you always come in clutch and are ready to troubleshoot. During competition, you strive to take your project to the next level in innovative ways.',
			},
			c: {
				name: 'Extrovert & Friendly',
				members: [
					{
						name: 'Jean Lin',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Jean-Lin-SW-VP.jpg',
						handle: '@jean_linnn',
						link: 'https://instagram.com/jean_linnn',
						linkType: 'Instagram',
					},
					{
						name: 'Steven Johnson',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Steven-Johnson-NE-Region-VP.jpg',
						handle: '@stevenj448',
						link: 'https://instagram.com/stevenj448',
						linkType: 'Instagram',
					},
					{
						name: 'Smriti Somasundaram',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Smriti-Somasundaram-Capital-VP.jpg',
						handle: '@smritis17',
						link: 'https://instagram.com/smritis17',
						linkType: 'Instagram',
					},
				],
				characteristics:
					'You bring an extra layer of joy and sunshine to any space you enter. You are able to break tense situations with a witty joke or well-timed comment. Like Jean and Steven, you strive to make sure everyone in your team is taken care of and able to perform at their full potential. Like Smriti, you are unable to hold in your own laughter during meetings, even if it’s sometimes a serious topic.',
			},
			d: {
				name: 'Adventurous',
				members: [
					{
						name: 'Haneol Lee',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Haneol-Lee-Final.jpg',
						handle: '@haneoljohn_lee',
						link: 'https://instagram.com/haneoljohn_lee',
						linkType: 'Instagram',
					},
					{
						name: 'Tina Zhang',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Tina-Zhang-State-Secretary.jpg',
						handle: '@tinaz0401',
						link: 'https://instagram.com/tinaz0401',
						linkType: 'Instagram',
					},
					{
						name: 'Kody Richards',
						picture:
							'https://assets.garytou.com/wafbla/kahoot-buzzfeed/Kody-Richards-North-Central-Region-VP.jpg',
						handle: '@kody.richards',
						link: 'https://instagram.com/kody.richards',
						linkType: 'Instagram',
					},
				],
				characteristics:
					'You are an adventurous spirit who strives to reach new limits, both in FBLA and in your personal life. The people around you will sometimes tell you that you care too much, but you are confident that the work you are doing will lead to great outcomes. Like Kody, you are intentional with your relationships and always have a way to make good conversation, even with strangers. Like John and Tina, the people in your life have great influence over your professional journey and you seek to have the same influence in the groups you are a part of.',
			},
		},
		// In case of tie, set default priority
		tieBreaker: ['a', 'b', 'd', 'c'],
		// Set your questions
		questions: [
			{
				question: 'How did you hear about FBLA?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Chapter adviser/officer', belongs: 'b' },
					b: { title: 'Flyer', belongs: 'd' },
					c: { title: 'Family/friend', belongs: 'c' },
					d: { title: 'Food/incentives', belongs: 'd' },
				},
			},
			{
				question:
					'Out of the following, which superpower would you like to have?',
				stats: true,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Invisibility', belongs: 'a' },
					b: { title: 'Super Strength', belongs: 'c' },
					c: { title: 'Telepathy', belongs: 'b' },
					d: { title: 'Flight', belongs: 'd' },
				},
			},
			{
				question: 'Why did you join FBLA?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Prepare for future business career', belongs: 'd' },
					b: { title: 'Learn new career and technical skills', belongs: 'a' },
					c: { title: 'Networking/friends', belongs: 'c' },
					d: { title: 'Competitive events', belongs: 'b' },
				},
			},
			{
				question:
					'What other clubs do you participate in the most outside of FBLA?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Leadership (ASB, student council)', belongs: 'd' },
					b: {
						title: 'Community Service (Key Club, Interact, Red Cross)',
						belongs: 'c',
					},
					c: { title: 'Hobbies (Photography, drama, music)', belongs: 'b' },
					d: { title: 'None of the above', belongs: 'a' },
				},
			},
			{
				question: 'Out of these snacks, which one do you like the most?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Vegetables and fruit', belongs: 'NONE' },
					b: { title: 'Chips', belongs: 'NONE' },
					c: { title: 'Candy', belongs: 'NONE' },
					d: { title: 'Baked goods', belongs: 'NONE' },
				},
			},
			{
				question: 'Which conference is most appealing to you?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Fall Leadership Conference', belongs: 'NONE' },
					b: { title: 'Winter Leadership Conference', belongs: 'NONE' },
					c: { title: 'State Business Leadership Conference', belongs: 'NONE' },
					d: { title: 'National Leadership Conference', belongs: 'NONE' },
				},
			},
			{
				question: 'What competitive events are you most interested in?',
				stats: true,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Test', belongs: 'a' },
					b: { title: 'Roleplay', belongs: 'c' },
					c: { title: 'Presentation + Prejudged', belongs: 'b' },
					d: { title: 'Interview + Production', belongs: 'd' },
				},
			},
			{
				question:
					'Which Hogwarts sorting house from the Harry Potter series are you in?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Hufflepuff', belongs: 'a' },
					b: { title: 'Ravenclaw', belongs: 'b' },
					c: { title: 'Gryffindor', belongs: 'd' },
					d: { title: 'Slytherin', belongs: 'c' },
				},
			},
			{
				question: 'What competition genre do you prefer to compete in?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: {
						title: 'Technology/computer programming/designing',
						belongs: 'b',
					},
					b: { title: 'Business and leadership', belongs: 'd' },
					c: { title: 'Advertising/social media', belongs: 'd' },
					d: { title: 'Service/customer oriented', belongs: 'a' },
				},
			},
			{
				question: 'If money was no object, would you travel all the time?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: {
						title: 'Yes, I dream of having adventures all over the world',
						belongs: 'b',
					},
					b: {
						title: 'Yeah, I’d definitely go on lots of nice vacations',
						belongs: 'c',
					},
					c: {
						title:
							'Maybe sometimes, it’s nice to go places, but I hate flying or driving long distances',
						belongs: 'a',
					},
					d: { title: 'Nah, I’m kind of a homebody', belongs: 'b' },
				},
			},
			{
				question: 'What music genre do you like best out of the following?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'R&B', belongs: 'b' },
					b: { title: 'Pop', belongs: 'c' },
					c: { title: 'Classical', belongs: 'a' },
					d: { title: 'Jazz', belongs: 'b' },
				},
			},
			{
				question: "What's your favorite FBLA initiative?",
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Business Achievement Awards (BAAs)', belongs: 'b' },
					b: { title: 'March of Dimes', belongs: 'c' },
					c: { title: 'Chapter Challenges', belongs: 'd' },
					d: { title: 'Community Service Awards (CSAs)', belongs: 'a' },
				},
			},
			{
				question: 'Which describes your personality?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Dependable and kind', belongs: 'a' },
					b: {
						title: 'A problem solver, analytical, and creative',
						belongs: 'b',
					},
					c: { title: 'Extroverted and friendly', belongs: 'c' },
					d: { title: 'Adventurous and likes to try new things', belongs: 'd' },
				},
			},
			{
				question: 'Which donut flavor do you enjoy the most?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'Chocolate (with or without sprinkles)', belongs: 'c' },
					b: { title: 'Glazed', belongs: 'b' },
					c: { title: 'Maple', belongs: 'a' },
					d: { title: 'Filled donuts', belongs: 'd' },
				},
			},
			{
				question:
					'Out of the following career fields, which most interests you?',
				stats: true,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: { title: 'STEM', belongs: 'b' },
					b: { title: 'Business + Economics', belongs: 'd' },
					c: { title: 'Social Science', belongs: 'c' },
					d: { title: 'Fine Arts', belongs: 'a' },
				},
			},
			{
				question: 'Which officer role appeals the most to you?',
				stats: false,
				answers: {
					// Each choice must be assigned to a result group!!!
					a: {
						title:
							'Executive Positions (President, Secretary, Public Relations)',
						belongs: 'NONE',
					},
					b: { title: 'Regional Vice President', belongs: 'NONE' },
					c: { title: 'Parliamentarian', belongs: 'NONE' },
					d: { title: 'Alumni and Business Relations VP', belongs: 'NONE' },
				},
			},
		],
	},
};
