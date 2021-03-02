import firebase from "firebase";

if (typeof window !== "undefined" && !firebase.apps.length) {
	firebase.initializeApp({
		apiKey: "AIzaSyBaCe-gJhAJK8s-73w9BLUKCA8yYTuoZbc",
		authDomain: "wafbla-kahoot-buzzfeed.firebaseapp.com",
		projectId: "wafbla-kahoot-buzzfeed",
		storageBucket: "wafbla-kahoot-buzzfeed.appspot.com",
		messagingSenderId: "50222004190",
		appId: "1:50222004190:web:b0553f289a7ebedea94f4f",
		measurementId: "G-DKCBFTG7K9",
	});

	firebase.database();
	firebase.analytics();
}

export default firebase;
