import {FirebaseClimb, FirebaseClimbEvent} from "./interfaces";

// eslint-disable-next-line require-jsdoc
export function firebaseToBigQueryClimb(id:string, oldClimb: FirebaseClimb, newClimb: FirebaseClimb) {
  // TODO: Only create records that where we've added an event

  const filteredClimbs: FirebaseClimbEvent[] = newClimb.events.filter(({createdOn: n}) => !oldClimb.events.some(({createdOn: o}) => o===n ));

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
