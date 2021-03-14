import * as functions from "firebase-functions";

import {BigQuery} from "@google-cloud/bigquery";
import {FirebaseClimb} from "./interfaces";
import {firebaseToBigQueryClimb} from "./mapper";
import {AuthenticationService, Days, GymScheduleService} from "@lkat/rhinofit-unofficial";
import * as _ from "lodash";

const {logger} = functions;
const client = new BigQuery();
const authService = new AuthenticationService();

export const onUpdate = functions.firestore
    .document("climbs/{climbID}")
    .onWrite(async (change, context) => {
      if (!change.before.exists) {
        logger.info("Document just created, not writing to BigQuery");
        return;
      }

      const climb = change.after.data() as FirebaseClimb;

      if (!Array.isArray(climb.events)) {
        logger.info("climb.events is not array, exiting");
        return;
      }

      const beforeClimb = change.before.data() as FirebaseClimb;

      const recordsToCreate = firebaseToBigQueryClimb(change.after.id, beforeClimb, climb);
      logger.debug("Debug data", {recordsToCreate, climb, beforeClimb});

      if (recordsToCreate.length ===0) {
        logger.info("No records to create");
        return;
      }

      let response;
      try {
        response = await client.dataset("lkat_climb").table("climbs_1").insert(recordsToCreate);
      } catch (e) {
        logger.error(JSON.stringify(e, null, 2));
      }

      logger.debug("done writing to bigquery", response);
    });

export const registerForClasses = functions.https.onCall(async (data, context) =>{
  if (!context.auth) {
    throw new Error("Auth must be there");
  }
  const userId = context.auth.uid;

  if (!userId) throw new Error("You must be logged in");
  if (!data) throw new Error("You must provide a body");
  const {email, password} = data;

  const credentials = await authService.login({
    email,
    password,
  });


  const scheduleService = new GymScheduleService({
    gymId: "a1c0a008",
    timeSlotIds: {
      16: "125396",
      18: "125397",
      20: "125398",
    },
  });
  const response = await scheduleService.registerForThisWeek({
    credentials,
    hourOfDay: 18,
    days: [Days.Monday, Days.Wednesday, Days.Friday],
  });
  console.log("responses", response);
  return response;
});
