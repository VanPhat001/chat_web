<script>
import AccountList from './AccountList.vue';
import messageService from '../services/message.service'
import accountService from '../services/account.service'
import { mapGetters, mapActions } from 'vuex';
export default {
    components: {
        AccountList
    },
    data() {
        return {
            friendsChat: [],
            notifyNumber: [],
            selectFriendIndex: 0,
            messages: [],
            text: '',
            intervalId: null,
            findAccountText: '',
            findAccounts: [],
            lastMessages: []
        }
    },

    computed: {
        ...mapGetters(['account']),
        selectFriend() {
            return this.friendsChat[this.selectFriendIndex]
        },
        accountLogin() {
            return this.account
        }
    },

    methods: {
        ...mapActions(['socketSendMessageToFriendChat']),

        async setSelectFriendIndex(index) {
            this.selectFriendIndex = index

            try {
                const data = await messageService.getAllMessage(this.account._id, this.selectFriend._id)
                this.messages = data
                this.notifyNumber[index] = 0
            } catch (error) {
                console.log(error)
            }
        },

        getDateTime(dateTimeString) {
            const date = new Date(dateTimeString)
            return date.toLocaleString()
        },

        scrollToLastMessage() {
            const element = document.getElementById('hidden-item')
            element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        },

        resetMessageContent() {
            this.text = ''
        },

        async sendMessage() {
            const EMPTY_STRING = ''
            if (this.text != EMPTY_STRING) {
                console.log('send message:', this.text);

                try {
                    const content = {
                        text: this.text,
                        image: null
                    }

                    const message = {
                        sender: this.accountLogin._id,
                        receipient: this.selectFriend._id,
                        content: content,
                        timeSend: new Date()
                    }

                    // render lại dữ liệu hiển thị trên chat-room
                    await messageService.createMessage(message.sender, message.receipient, message.content)
                    this.messages.push(message)
                    this.loadPreviewLastMessage()

                    // gửi tin socket để các client khác nhận thông báo `có tin nhắn`
                    this.socketSendMessageToFriendChat(message)
                    this.resetMessageContent()
                } catch (error) {
                    console.log(error)
                }
            }
        },

        receiveMessage() {
            this.intervalId = setInterval(async () => {
                // listen message from socket and render layout
                // REFERENCE receiveMessageQueue TO $store.state.receiveMessageQueue
                const receiveMessageQueue = this.$store.state.receiveMessageQueue

                while (receiveMessageQueue.length > 0) {
                    const message = receiveMessageQueue.shift()

                    if (message.sender === this.accountLogin._id) {
                        // thay đổi trạng thái đã gửi thành đã nhận 
                    }
                    else if (message.sender === this.selectFriend?._id) {
                        this.messages.push(message)
                        await this.loadPreviewLastMessage()
                    }
                    else {
                        const friendId = message.sender
                        const friendChat = await accountService.getById(friendId)

                        // sender có trong friendsChat
                        // ---> tăng notify lên 1
                        // sender không có trong friendsChat
                        // ---> thêm account bên sidebar và hiện notify có tin nhắn mới

                        const indexFound = this.friendsChat.findIndex(acc => acc._id == friendChat._id)
                        const NOT_FOUND = -1

                        if (indexFound === NOT_FOUND) {
                            this.friendsChat.push(friendChat)
                            this.notifyNumber.push(1)
                        }
                        else {
                            this.notifyNumber[indexFound]++
                        }

                        await this.loadPreviewLastMessage()
                    }

                }

            }, 1000);
        },

        async loadPreviewLastMessage() {
            const userId = this.account._id
            const lastMessages = await messageService.getAllLastMessOfUserToFriends(userId)

            const map = new Map()
            lastMessages.forEach(mess => {
                if (mess.sender == userId) {
                    map.set(mess.receipient, mess)
                }
                else {
                    map.set(mess.sender, mess)
                }
            })

            const data = []
            this.friendsChat.forEach(friend => {
                data.push(map.get(friend._id))
            })

            this.lastMessages = data
        },

        hideModel() {
            const modelElement = this.$refs['model']
            modelElement.classList.add('hide')
        },

        selectAccountHandle(index) {
            const account = this.findAccounts[index]

            const result = this.friendsChat.find(friend => friend._id == account._id)
            const NOT_FOUND = undefined

            if (result === NOT_FOUND) {
                this.friendsChat.push(account)
            }

            this.hideModel()
        },

        async findAccountByNameOrId() {
            try {
                this.findAccounts = await accountService.findByNameOrId(this.findAccountText)

                const modelElement = this.$refs['model']
                modelElement.classList.remove('hide')
            } catch (error) {
                console.log(error)
            }
        }
    },

    async created() {
        const accountId = this.account._id
        try {
            // get friends chat id array ===> [ accountId ]
            const friendsChat = await messageService.getFriendsChat(accountId)
            console.log(friendsChat);

            // fetch api to get friends chat account  ===> [ {_id, username, password...} ]
            const getFriendsChatPromises = []
            friendsChat.forEach(friendId => {
                getFriendsChatPromises.push(accountService.getById(friendId))
            })

            const data = await Promise.all(getFriendsChatPromises)
            for (let i = 0; i < data.length; i++) {
                this.notifyNumber.push(0)
                this.lastMessages.push({})
            }

            this.friendsChat = data
            await this.loadPreviewLastMessage()

            // lắng nghe dữ liệu trả về từ socket
            this.receiveMessage()
        } catch (error) {
            console.log(error)
        }
    },

    updated() {
        this.scrollToLastMessage()
    },

    unmounted() {
        clearInterval(this.intervalId)
    }
}
</script>



<template >
    <div class="chat-room">

        <div ref='model' class="model hide">
            <div class="background" @click="hideModel"></div>
            <AccountList class="account-list" :pAccounts="findAccounts" @selectAccount="selectAccountHandle">
            </AccountList>
        </div>

        <div class="sidebar">
            <div class="friend-chat-find">
                <input type="text" placeholder="Nhập tên hoặc id tài khoản" v-model="findAccountText"
                    @keyup.enter="findAccountByNameOrId">
                <button @click="findAccountByNameOrId">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>

            <ul class="friend-chat-list">
                <li class="friend-chat" v-for="(friend, index) in friendsChat" :key="index" @click="setSelectFriendIndex(index)">
                    <img class="avatar" :src="friend.avatar">
                    <div class="info">
                        <p class="name">{{ friend.lastName + ' ' + friend.firstName }}</p>
                        <template v-if="index < lastMessages.length && lastMessages[index] !== undefined">
                            <p class="text">
                                <span v-if="lastMessages[index].sender == accountLogin._id">Bạn: </span> 
                                {{ lastMessages[index].content.text }}                            
                            </p>
                            <p class="time">{{ new Date(lastMessages[index].timeSend).toLocaleString() }}</p>
                        </template>
                        <div class="notify-number" v-if="notifyNumber[index] != 0">{{ notifyNumber[index] }}</div>
                    </div>
                </li>
            </ul>
        </div>

        <div class="main-box">
            <div class="receipient-bar">
                <template v-if="selectFriendIndex < friendsChat.length">
                    <img class="avatar" :src="selectFriend.avatar">
                    <p class="name">{{ `${selectFriend.lastName} ${selectFriend.firstName}` }}</p>

                    <div class="btn btn-info">
                        <i class="fa-solid fa-info"></i>
                    </div>
                </template>
            </div>

            <div class="chat-box">
                <div :class="{ 'message-info': true, 'right': message.sender === accountLogin._id, 'left': message.sender === selectFriend._id }"
                    v-for="(message, index) in messages" :key="index">

                    <template v-if="message.sender === accountLogin._id">
                        <img class="avatar" :src="accountLogin.avatar">
                        <p class="message" :title="getDateTime(message.timeSend)">{{ message.content.text }}</p>
                    </template>

                    <template v-else>
                        <img class="avatar" :src="selectFriend.avatar">
                        <p class="message" :title="getDateTime(message.timeSend)">{{ message.content.text }}</p>
                    </template>
                </div>

                <div id="hidden-item" style="height: 24px;"></div>
            </div>

            <div class="messages-bar">
                <!-- <input type="text" placeholder="enter text here"> -->
                <textarea placeholder="enter text here" v-model="text" @keydown.enter.prevent="sendMessage"></textarea>
                <button @click="sendMessage">send</button>
            </div>
        </div>

    </div>
</template>


<style lang="scss" scoped>
.hide {
    display: none;
}

// ====================== layout ====================== 


.model {
    .background {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.39);
        z-index: 1;
    }

    .account-list {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;

        background-color: var(--color-background);
        padding: 24px;
        border: 1px solid red;
        max-width: 80%;
        max-height: 80%;
        width: 400px;
        height: 500px;
    }
}

.chat-room {
    // height: 100vh;
    height: 100%;
    width: 100%;
    position: relative;

    .sidebar {
        height: 100%;
        width: 300px;

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
    }

    .main-box {
        height: 100%;
        width: calc(100% - 300px);
        margin-left: 300px;

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
    }
}

// ======================= public style =======================
img.avatar {
    --avatar-size: 54px;
    width: var(--avatar-size);
    height: var(--avatar-size);
    border-radius: 50%;
}

/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    // background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;

}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}

// ======================= sidebar style =======================
.sidebar {
    --find-friend-input-height: 36px;
    --friend-chat-padding-top-bottom: 16px;

    .friend-chat-find {
        position: relative;
        padding: var(--friend-chat-padding-top-bottom) 0;

        input {
            height: var(--find-friend-input-height);
            border-radius: var(--find-friend-input-height);
            width: 100%;
            padding: 0 32px 0 12px;
            font-size: 16px;
        }

        button {
            position: absolute;
            top: 50%;
            right: 3px;
            transform: translate(0, -50%);

            height: var(--find-friend-input-height);
            background-color: transparent;
            border: none;
            padding: 0 10px 0 4px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            opacity: .5;
        }
    }

    .friend-chat-list {
        border: 1px solid blue;
        height: calc(100% - var(--find-friend-input-height) + calc(-1) * 2 * var(--friend-chat-padding-top-bottom));
        overflow-y: auto;

        .friend-chat {
            // border: 1px solid green;
            display: flex;
            margin-top: 12px;

            &:hover {
                background-color: rgb(221, 216, 216);
                cursor: pointer;
            }

            .avatar {
                margin: 0 8px;
            }

            .info {
                flex: 1;
                position: relative;
                // &>* {
                //     border: 1px solid gray;
                // }

                .name {
                    width: 100%;
                    font-weight: bold;
                }

                .text {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }

                .time {
                    opacity: .6;                    
                }

                .notify-number {
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    color: white;
                    font-weight: bold;
                    font-size: 12px;
                    background-color: royalblue;

                    position: absolute;
                    top: 50%;
                    right: 12px;
                    transform: translateY(-50%);
                }
            }
        }
    }
}

// ======================= main-box style =======================
.main-box {
    display: flex;
    flex-direction: column;

    .receipient-bar {
        border: 1px solid blue;
        display: flex;
        align-items: center;
        padding: 4px 10px;

        .avatar {
            // --avatar-size: 40px;
        }

        .name {
            margin-left: 10px;
            font-weight: bold;
            font-size: 1.3rem;
        }

        .btn-info {
            margin-left: auto;
            border-radius: 50%;
            font-size: 15px;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: var(--color-3);
            color: white;
            opacity: .8;

            &:active,
            &:hover {
                opacity: 1;
            }
        }
    }

    .chat-box {
        flex: 1;
        overflow-y: auto;

        .message-info {
            display: flex;
            width: 66%;
            margin-top: 4px;

            &.right+.right .avatar,
            &.left+.left .avatar {
                opacity: 0;
            }

            
            &.right {
                margin-left: auto;
                flex-direction: row-reverse;
            }

            &.left {
                .message {
                    background-color: lightgray;
                }
            }

            .avatar {
                --avatar-size: 30px;
            }

            .message {
                color: var(--color-text);
                background: var(--color-2);
                border-radius: 5px;
                padding: 3px 8px;
                margin: 0 3px;
            }

        }
    }

    .messages-bar {
        height: 40px;
        // padding-bottom: 10px;
        display: flex;

        input,
        textarea {
            flex: 1;
            resize: none;
            padding: 5px;
        }

        button {
            font-size: 1.2rem;
            padding: 0 24px;
        }
    }
}
</style>