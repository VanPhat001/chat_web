const state = {        
    account: null,
    socket: null,
    receiveMessageQueue: [],
    accountMap: new Map(),
    accountMap_intervalId: null
}

export default state