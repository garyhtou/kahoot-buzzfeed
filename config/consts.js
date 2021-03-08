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
      c: {
        name: "Funnier group",
        members: [
          { name: "State Officer 1", picture: "https://somewhere.com/so1" },
          { name: "State Officer 1", picture: "https://somewhere.com/so1" },
        ],
        characteristics: "filler",
      },
      d: {
        name: "d group",
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
        answers: {
          // Each choice must be assigned to a result group!!!
          a: { title: "Presentation", belongs: "c" },
          b: { title: "Test", belongs: "c" },
          c: { title: "Demonstration", belongs: "c" },
          d: { title: "Prejudged", belongs: "c" },
        },
      },
      {
        question: "What type of competitive event do you like?",
        answers: {
          // Each choice must be assigned to a result group!!!
          a: { title: "Presentation", belongs: "a" },
          b: { title: "Test", belongs: "b" },
          c: { title: "Demonstration", belongs: "c" },
          d: { title: "Prejudged", belongs: "b" },
        },
      },
      {
        question: "What type of competitive event do you like?",
        answers: {
          // Each choice must be assigned to a result group!!!
          a: { title: "Presentation", belongs: "a" },
          b: { title: "Test", belongs: "b" },
          c: { title: "Demonstration", belongs: "c" },
          d: { title: "Prejudged", belongs: "c" },
        },
      },
      {
        question: "What type of competitive event do you like?",
        answers: {
          // Each choice must be assigned to a result group!!!
          a: { title: "Presentation", belongs: "a" },
          b: { title: "Test", belongs: "b" },
          c: { title: "Demonstration", belongs: "c" },
          d: { title: "Prejudged", belongs: "c" },
        },
      },
      {
        question: "What type of competitive event do you like?",
        answers: {
          // Each choice must be assigned to a result group!!!
          a: { title: "Presentation", belongs: "a" },
          b: { title: "Test", belongs: "b" },
          c: { title: "Demonstration", belongs: "c" },
          d: { title: "Prejudged", belongs: "c" },
        },
      },
      {
        question: "What type of competitive event do you like?",
        answers: {
          // Each choice must be assigned to a result group!!!
          a: { title: "Presentation", belongs: "a" },
          b: { title: "Test", belongs: "b" },
          c: { title: "Demonstration", belongs: "c" },
          d: { title: "Prejudged", belongs: "c" },
        },
      },
    ],
  },
};
