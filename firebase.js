import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmNwysNvrrC4rwOnDbg8yw5qUl-aOLaA4",
  authDomain: "bathrooms-66a88.firebaseapp.com",
  projectId: "bathrooms-66a88",
  storageBucket: "bathrooms-66a88.appspot.com",
  messagingSenderId: "955747464824",
  appId: "1:955747464824:web:3f9b302f4339024eb99f8d",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth(app);

const bathroomsRef = collection(db, "bathrooms");

export async function getFromLoc(
  latitude,
  latitudeDelta,
  longitude,
  longitudeDelta
) {
  const qLatRes = [];
  const qLongRes = [];
  const finRes = [];

  console.log(
    "starting search for region at latitude of ",
    latitude,
    " and longitude of ",
    longitude
  );

  console.log("latitude query");
  const qLat = query(
    bathroomsRef,
    where("latitude", ">=", latitude - latitudeDelta - 0.1 * latitudeDelta),
    where("latitude", "<=", latitude + latitudeDelta + 0.1 * latitudeDelta)
  );

  console.log("longitude query");
  const qLong = query(
    bathroomsRef,
    where("longitude", ">=", longitude - longitudeDelta - 0.1 * longitudeDelta),
    where("longitude", "<=", longitude + longitudeDelta + 0.1 * longitudeDelta)
  );

  console.log("getting latitude docs");
  const qLatSnapshot = await getDocs(qLat);
  qLatSnapshot.forEach((doc) => {
    qLatRes.push(doc.data());
  });
  console.log("completed latitude with", qLatRes.length, "results");

  console.log("getting longitude docs");
  const qLongSnapshot = await getDocs(qLong);
  qLongSnapshot.forEach((doc) => {
    qLongRes.push(doc.data());
  });
  console.log("completed longitude with", qLongRes.length, "results");

  console.log("finding matches");
  if (qLatRes.length < qLongRes.length) {
    console.log("option 1");
    for (let i = 0; i < qLatRes.length; i++) {
      for (let j = 0; j < qLongRes.length; j++) {
        if (qLatRes[i].id == qLongRes[j].id) {
          finRes.push(qLatRes[i]);
        }
      }
    }
  } else if (qLongRes.length < qLatRes.length) {
    console.log("option 2");
    for (let i = 0; i < qLongRes.length; i++) {
      for (let j = 0; j < qLatRes.length; j++) {
        if (qLongRes[i].id === qLatRes[j].id) {
          finRes.push(qLongRes[i]);
        }
      }
    }
  }

  console.log("completed with", finRes.length, "results");
  return finRes;
}

export { auth, bathroomsRef };
