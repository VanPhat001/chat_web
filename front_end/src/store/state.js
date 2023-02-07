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

    userCallId: null, // lưu trữ id của tài khoản người gọi đến
    showIncommingCall: false,
    localCallId: null,
    peer: null
}

export default state