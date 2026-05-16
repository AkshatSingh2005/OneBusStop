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

    return docRef.id; // Return the document ID

  } catch(error){

    console.error(
  "Firebase save error:",
  JSON.stringify(error, null, 2)
);
  }
};

export const saveTripData = async (tripId, tripData) => {
  try {
    // Save each data point as a separate document in a subcollection
    const batch = [];
    for (const dataPoint of tripData) {
      batch.push(addDoc(collection(db, `trips/${tripId}/data`), dataPoint));
    }
    await Promise.all(batch);
    console.log(`Trip data saved for trip ${tripId}`);
  } catch (error) {
    console.error("Error saving trip data:", error);
  }
};