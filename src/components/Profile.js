// components/Profile.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { auth, db } from "../firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Profile() {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>UID: {user.uid}</p>
    </div>
  );
}

export default Profile;
