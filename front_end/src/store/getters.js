const getters = {
    account(state) {
        return state.account
    },
    socket(state) {
        return state.socket
    },
    receiveMessageQueue(state) {
        return state.receiveMessageQueue
    },
    accountMap(state) {
        return state.accountMap
    },
    showIncommingCall(state) {
        return state.showIncommingCall
    }
}

export default getters