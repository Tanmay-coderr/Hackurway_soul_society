// authController.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const signupUser = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email
    });

    res.status(201).json({ message: "User registered successfully", uid: user.uid });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    res.status(200).json({ uid: user.uid, data: userDoc.data() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
