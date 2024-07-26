import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FIRESTORE_DB } from "../firebaseConfig";

const Test = () => {
  // useEffect(() => {
  //   const updateDocumentsWithNewField = async () => {
  //     try {
  //       const querySnapshot = await getDocs(
  //         query(
  //           collection(FIRESTORE_DB, "records"),
  //           where("userEmail", "==", "7nguyennguyen3@gmail.com") // Inequality filter
  //         )
  //       );

  //       const batch = writeBatch(FIRESTORE_DB);

  //       querySnapshot.forEach((doc) => {
  //         const docData = doc.data();
  //         const docRef = doc.ref;

  //         if (docData.date) {
  //           const date = new Date(docData.date);
  //           const year = date.getFullYear();
  //           const month = date.getMonth() + 1; // Get month (0-based index)

  //           batch.update(docRef, { year, month }); // Update document with new fields
  //         }
  //       });

  //       await batch.commit(); // Commit the batch update

  //       console.log(
  //         "Documents updated with new fields where userEmail is 7nguyennguyen3@gmail.com"
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       console.log("update operation completed");
  //     }
  //   };

  //   updateDocumentsWithNewField();
  // }, []);

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Test;
