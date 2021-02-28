export interface FirebaseClimbEvent {
    createdOn: string
    difficulty: number
    type: string
    version: number
}

export interface CustomFirebaseTimestamp {
    _seconds: number;
    _nanoseconds: number;
}

export interface FirebaseClimb {
    createdAt: CustomFirebaseTimestamp
    documentCreatedOn: string
    id: string
    events: FirebaseClimbEvent[]
    deleted: boolean
    userId: string
    name: string
}
