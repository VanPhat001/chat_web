const mutations = {
    setAccount(state, value) {
        state.account = value
    },
    setSocket(state, value) {
        state.socket = value
    },
    addReceiveMessageQueue(state, value) {
        state.receiveMessageQueue.push(value)        
    }
}

export default mutations