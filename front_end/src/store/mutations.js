const mutations = {
    setAccount(state, value) {
        state.account = value
    },

    setSocket(state, value) {
        state.socket = value
    },

    addReceiveMessageQueue(state, value) {
        state.receiveMessageQueue.push(value)
    },

    // getAccountMap(state, accId) {
    //     return state.accountMap.get(accId)
    // },

    // setAccountMap(state, accId, acc) {
    //     state.accountMap.set(accId, acc)
    // },

    // hasAccountMap(state, accId) {
    //     return state.accountMap.has(accId)
    // },
}

export default mutations