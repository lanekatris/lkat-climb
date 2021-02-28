import {FirebaseClimb, FirebaseClimbEvent} from "./interfaces";
import {differenceBy} from "lodash";

// eslint-disable-next-line require-jsdoc
export function firebaseToBigQueryClimb(id:string, oldClimb: FirebaseClimb, newClimb: FirebaseClimb) {
  // TODO: Only create records that where we've added an event

  const filteredClimbs: FirebaseClimbEvent[] = differenceBy(oldClimb.events, newClimb.events, "createdOn");

  return filteredClimbs.map((event) => {
    const {createdOn: eventCreatedOn, difficulty, ...rest}=event;

    const documentCreatedOn = new Date(1970, 0, 1);
    documentCreatedOn.setSeconds(newClimb.createdAt._seconds);

    return {
      documentCreatedOn: documentCreatedOn.toISOString(),
      id: id,
      deleted: newClimb.deleted,
      userId: newClimb.userId,
      name: newClimb.name,
      eventCreatedOn,
      difficulty1: difficulty,
      ...rest,
    };
  });
}
