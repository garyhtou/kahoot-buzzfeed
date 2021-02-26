export default {
	groups: {
		a: {
			name: "Funny group",
			members: [
				{ name: "State Officer 1", picture: "https://somewhere.com/so1" },
				{ name: "State Officer 1", picture: "https://somewhere.com/so1" },
			],
		},
		b: {
			name: "Funnier group",
			members: [
				{ name: "State Officer 1", picture: "https://somewhere.com/so1" },
				{ name: "State Officer 1", picture: "https://somewhere.com/so1" },
			],
		},
	},
	questions: {
		a: {
			question: "What type of competitive event do you like?",
			answers: [
				{ title: "Presentation", belongs: "a" },
				{ title: "Test", belongs: "b" },
				{ title: "Demonstration", belongs: "c" },
			],
		},
	},
};
