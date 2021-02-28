import * as functions from "firebase-functions";
// import * as firebase from "firebase";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

interface FirebaseClimbEvent {
    createdOn: string
    difficulty: number
    type: string
    version: number
}

interface CustomFirebaseTimestamp {
    _seconds: number;
    _nanoseconds: number;
}

interface FirebaseClimb {
    createdAt: CustomFirebaseTimestamp
    documentCreatedOn: string
    id: string
    events: FirebaseClimbEvent[]
    deleted: boolean
    userId: string
    name: string
}

export const onUpdate = functions.firestore
    .document("climbs/{climbID}")
    .onWrite((change, context) => {
      // console.log("onupdate", {change, context});
      //   change.after.id

      const climb = change.after.data() as FirebaseClimb;

      const recordsToCreate = climb.events.map((event)=>{
        const {createdOn: eventCreatedOn, ...rest}=event;

        const documentCreatedOn = new Date(1970, 0, 1);
        documentCreatedOn.setSeconds(climb.createdAt._seconds);

        return {
          documentCreatedOn: documentCreatedOn.toISOString(),
          id: change.after.id,
          deleted: climb.deleted,
          userId: climb.userId,
          name: climb.name,
          eventCreatedOn,
          ...rest,
        };
      });

      console.log("new", {recordsToCreate, climb});
      return Promise.resolve();
    });
