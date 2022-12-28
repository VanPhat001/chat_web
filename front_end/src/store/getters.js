const getters = {
    account(state) {
        return state.account
    },
    socket(state) {
        return state.socket
    },
    receiveMessageQueue(state) {
        return state.receiveMessageQueue
    }
}

export default getters