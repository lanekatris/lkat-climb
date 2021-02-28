import * as functions from "firebase-functions";

import {BigQuery} from "@google-cloud/bigquery";
import {FirebaseClimb} from "./interfaces";
import {firebaseToBigQueryClimb} from "./mapper";

const {logger} = functions;
const client = new BigQuery();

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
        // response = await client.dataset("lkat_climb").table("climbs_1").query();
      } catch (e) {
        logger.error(JSON.stringify(e, null, 2));
      }

      logger.debug("done writing to bigquery", response);
    });
