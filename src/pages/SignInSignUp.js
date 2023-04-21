// components/SignInSignUp.js
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../slices/userSlice";
import { auth, db, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../components/Header";
import InputComponent from "../components/Input";
import Button from "../components/Button";
import FileInput from "../components/Input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function SignInSignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [flag, setFlag] = useState(false);
  const [fileURL, setFileURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    // e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        uid: user.uid,
        profilePic: fileURL,
      });

      // Update authentication state and user information in the store
      dispatch(
        setUser({
          email: user.email,
          uid: user.uid,
          name: name,
          profilePic: fileURL,
        })
      );
      navigate("/profile");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      dispatch(
        setUser({
          name: userData.name,
          email: user.email,
          uid: user.uid,
          profilePic: userData.profilePic,
        })
      );
      navigate("/profile");
      // Navigate to the profile page
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const uploadImage = async (file) => {
    setLoading(true);
    console.log("hi", file);
    try {
      const imageRef = ref(
        storage,
        `podcasts/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(imageRef, file);

      const imageURL = await getDownloadURL(imageRef);
      setFileURL(imageURL);
      setLoading(false);
      console.log("IMageURL", imageURL);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Header />
      {!flag ? (
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form>
            <InputComponent
              type="text"
              placeholder="Full Name"
              state={name}
              setState={setName}
            />
            <InputComponent
              type="email"
              placeholder="Email"
              state={email}
              setState={setEmail}
            />
            <InputComponent
              type="password"
              placeholder="Password"
              state={password}
              setState={setPassword}
            />

            <FileInput onFileSelected={uploadImage} />

            <Button
              onClick={handleSignUp}
              text={loading ? "Loading..." : "Sign Up"}
            />

            {/* <button onClick={handleSignOut}>Sign Out</button> */}
          </form>
        </div>
      ) : (
        <div>
          <div className="signup-form">
            <h2>Sign In</h2>
            <form>
              <InputComponent
                type="email"
                placeholder="Email"
                state={email}
                setState={setEmail}
              />
              <InputComponent
                type="password"
                placeholder="Password"
                state={password}
                setState={setPassword}
              />

              <Button onClick={handleSignIn} text={"Sign In"} />

              {/* <button onClick={handleSignOut}>Sign Out</button> */}
            </form>
          </div>
        </div>
      )}
      <p
        style={{ cursor: "pointer", marginTop: "2rem" }}
        onClick={() => setFlag(!flag)}
      >
        Already Have An Account? Sign In.
      </p>
    </div>
  );
}

export default SignInSignUp;
