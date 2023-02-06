const state = {        
    account: null,
    socket: null,
    receiveMessageQueue: [],
    accountMap: new Map(),
    accountMap_intervalId: null,
    GENDER: Object.freeze({
        MALE: 'male',
        FEMALE: 'female',
        OTHER: 'other'
    }),
    showIncommingCall: false,
    userCallId: null
}

export default state