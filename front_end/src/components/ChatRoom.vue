<script>
import messageService from '../services/message.service'
import accountService from '../services/account.service'
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            friendsChat: [],
            selectFriendIndex: 0,
            messages: [],
            text: '',
            intervalId: null
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
            } catch (error) {
                console.log(error)
            }
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

                    // gửi tin socket để các client khác nhận thông báo `có tin nhắn`
                    this.socketSendMessageToFriendChat(message)
                    this.resetMessageContent()
                } catch (error) {
                    console.log(error)
                }
            }
        },

        receiveMessage() {
            this.intervalId = setInterval(() => {
                // listen message from socket and render layout
                // REFERENCE receiveMessageQueue TO $store.state.receiveMessageQueue
                const receiveMessageQueue = this.$store.state.receiveMessageQueue

                while (receiveMessageQueue.length > 0) {
                    const message = receiveMessageQueue.shift()

                    if (message.sender === this.accountLogin._id) {
                        // thay đổi trạng thái đã gửi thành đã nhận
                    }
                    else if (message.sender === this.selectFriend._id) {
                        this.messages.push(message)
                    }
                    else {
                        // hiện notify bên sidebar
                    }

                }

            }, 1000);
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
            this.friendsChat = data

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

        <div class="sidebar">
            <ul class="friend-chat-list">
                <li class="friend-chat" v-for="(friend, index) in friendsChat" @click="setSelectFriendIndex(index)">
                    <img class="avatar" :src="friend.avatar">
                    <div class="info">
                        <p class="name">{{ friend.lastName + ' ' + friend.firstName }}</p>
                        <!-- <p class="text">friend chat text </p> -->
                    </div>
                </li>
                <!-- <li class="friend-chat" v-for="item in 20">
                    <img class="avatar" src="https://i.pinimg.com/236x/93/a0/0a/93a00a3684652031a0c398c5d54d3d10.jpg">
                    <div class="info">
                        <p class="name">friend chat name</p>
                        <p class="text">friend chat text </p>
                    </div>
                </li> -->
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
                <div :class="{ 'message-info': true, 'right': message.sender === accountLogin._id, 
                               'left': message.sender === selectFriend._id }"
                    v-for="(message, index) in messages" :key="index">

                    <template v-if="message.sender === accountLogin._id">
                        <img class="avatar" :src="accountLogin.avatar">
                        <p class="message">{{ message.content.text }}</p>
                    </template>

                    <template v-else>
                        <img class="avatar" :src="selectFriend.avatar">
                        <p class="message">{{ message.content.text }}</p>
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
// ====================== layout ====================== 
.chat-room {
    height: 100vh;
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
    --avatar-size: 50px;
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
    .friend-chat-list {
        border: 1px solid blue;
        height: 100%;
        overflow-y: auto;

        .friend-chat {
            // border: 1px solid green;
            display: flex;

            &:hover {
                background-color: rgb(221, 216, 216);
                cursor: pointer;
            }

            &:not(:first-child) {
                margin-top: 5px;
            }

            .avatar {
                margin: 0 8px;
            }

            .info {
                flex: 1;
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

            &.right {
                margin-left: auto;
                flex-direction: row-reverse;
            }

            &.right+.right .avatar,
            &.left+.left .avatar {
                opacity: 0;
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