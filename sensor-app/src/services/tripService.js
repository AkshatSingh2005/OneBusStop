import {

  collection,
  addDoc

} from "firebase/firestore";

import { db }
from "../firebaseConfig";

export const saveTripSummary =
async(summary) => {

  try {

    const docRef = await addDoc(

      collection(db, "trips"),

      summary

    );

    console.log(
      "Trip saved:",
      docRef.id
    );

  } catch(error){

    console.error(
      "Firebase save error:",
      error
    );
  }
};