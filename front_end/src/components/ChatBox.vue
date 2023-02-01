<template>
    <div class="chat-box">
        <div class="receipient-bar">
            <template v-if="friendChatAcc">
                <img class="avatar" :src="friendChatAcc.avatar">
                <router-link :to="{ name: 'profile', params: { 'id': friendChatAcc._id } }">
                    <p class="name">{{ `${friendChatAcc.lastName} ${friendChatAcc.firstName}` }}</p>
                </router-link>

                <span class="btn btn-info" @click="openOrCloseSideBarRight">
                    <i class="fa-solid fa-info"></i>
                </span>
            </template>
        </div>

        <div class="message-list" :class="{'loadding': !loaded, 'loaded': loaded}">
            <LoaddingComponent class="loadding-component view"></LoaddingComponent>

            <div :class="{ 'message-info': true, 'right': message.sender === accountLogin._id, 'left': message.sender === friendChatAcc._id }"
                v-for="(message, index) in messages" :key="`${message._id}-${message.unsend}`" :data-index="index">

                <template v-if="message.sender === accountLogin._id">
                    <img class="avatar" :src="accountLogin.avatar">

                    <div class="message unsend" v-if="message.unsend">
                        <p :title="getDateTime(message.timeSend)">Tin nhắn đã được thu hồi</p>
                    </div>
                    <div class="message" v-else-if="message.content.text">
                        <p :title="getDateTime(message.timeSend)">{{ message.content.text }}</p>
                    </div>
                    <div class="message" v-else>
                        <img :src="message.content.image" :title="getDateTime(message.timeSend)" alt="lỗi hiển thị"
                            @click="openImageFullScreen(message.content.image)">
                    </div>
                </template>

                <template v-else>
                    <img class="avatar" :src="friendChatAcc.avatar">

                    <div class="message unsend" v-if="message.unsend">
                        <p :title="getDateTime(message.timeSend)">Tin nhắn đã được thu hồi</p>
                    </div>
                    <div class="message" v-else-if="message.content.text">
                        <p :title="getDateTime(message.timeSend)">{{ message.content.text }}</p>
                    </div>
                    <div class="message" v-else>
                        <img :src="message.content.image" :title="getDateTime(message.timeSend)" alt="lỗi hiển thị"
                            @click="openImageFullScreen(message.content.image)">
                    </div>
                </template>

                <ExpandBox class="expand-box" :class="{ 'reverse': message.sender !== accountLogin._id }"
                    @react="reactMessage" @unsend="unsendMessage" @response="responseMessage">
                </ExpandBox>
            </div>

            <div id="hidden-item" style="height: 24px;"></div>
        </div>

        <div class="messages-bar">
            <div class="row">
                <div class="col">
                    <img ref="img">
                </div>
            </div>
            <div class="row">
                <div class="col col-fill pos-relative">
                    <textarea placeholder="Enter to submit" v-model="text" @keydown="debounce"
                        @keydown.enter.prevent="sendMessage"></textarea>

                    <div class="emoji-picker-box">
                        <EmojiPicker v-show="openEmojiPicker" class="emoji-picker" @onSelectEmoji="selectEmojiHandle">
                        </EmojiPicker>

                        <button class="btn btn-emoji" @click="openOrCloseEmojiPicker">
                            <i class="fa-solid fa-face-laugh-squint"></i>
                        </button>
                    </div>
                    <button class="btn" @click="sendMessage">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.avatar {
    --size: 30px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
}

.loadding {
    .loadding-component.view {
        --background-color: #242526;
        --color: white;
    
        position: absolute;
        inset: 0;
        z-index: 900;
    }
    
    .message-info {
        height: 0;
    }
}

.loaded {
    .loadding-component.view {
        display: none;
    }
}


.message-info {
    .react {
        position: relative;

        &::before {
            content: '💝';
            position: absolute;
            bottom: 0;
            display: flex;
            width: 20px;
            height: 20px;
            // background-color: #242526d5;
            border-radius: 50%;
            z-index: 1;
            zoom: 1.15;
        }
    }

    &.left .react::before {
        left: 100%;
        transform: translate(-68%, 42%);
    }

    &.right .react::before {
        right: 100%;
        transform: translate(68%, 42%);
    }
}


.emoji-picker-box {
    position: relative;

    .emoji-picker {
        position: absolute;
        bottom: 100%;
        right: 0;
    }

    .btn-emoji {
        padding: 4px !important;
        border: none;
        background-color: transparent !important;
        color: royalblue !important;
        height: 100%;

        &:hover {
            opacity: 1;
        }

        &,
        &:active {
            opacity: .8;
        }
    }
}

.chat-box {
    display: flex;
    flex-direction: column;

    .receipient-bar {
        display: flex;
        align-items: center;
        padding: 4px 10px;
        border: 1px solid rgb(65, 65, 65);

        .avatar {
            --size: 44px;
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
            background-color: royalblue;
            color: white;
            opacity: .8;

            &:active,
            &:hover {
                opacity: 1;
            }
        }
    }

    .message-list {
        flex: 1;
        padding: 0 8px;
        overflow-y: auto;
        position: relative;

        .message-info {
            display: flex;
            width: 66%;
            margin-top: 1px;

            &.right+.right .avatar,
            &.left+.left .avatar {
                opacity: 0;
                height: 1px;
            }

            &.right {
                margin-left: auto;
                flex-direction: row-reverse;
            }

            &.left {
                .message {
                    p {
                        background-color: lightgray;
                    }
                }
            }

            .avatar {
                --avatar-size: 26px;
            }

            .message {
                max-width: 72%;
                margin: 0 1px;

                &.unsend p {
                    opacity: .8;
                }

                p,
                img {
                    border-radius: 6px;
                    width: 100%;
                }

                p {
                    padding: 3px 8px;
                    background-color: var(--color-2);
                    color: var(--color-text)
                }
            }

            .expand-box {
                --color: #888;
                --box-color: #353738e3;
                margin: auto 0;
                display: none;
            }

            &:hover .expand-box {
                display: flex;
            }
        }
    }

    .messages-bar {
        .row {
            display: flex;

            &>.col {
                display: flex;

                &.col-fill {
                    flex: 1;
                }
            }
        }

        .row:nth-child(1) {
            img {
                // height: 80px;
            }
        }

        .row:nth-child(2) {
            border: 1px solid #555;
            background-color: #494949;
            border-radius: 2px;
            overflow: hidden;

            .col {
                background-color: transparent;

                textarea {
                    flex: 1;
                    resize: none;
                    font-size: 15px;
                    padding: 5px 3px;
                    background-color: transparent;
                    color: rgb(216, 216, 216);
                    border: none;

                    /* width */
                    &::-webkit-scrollbar {
                        width: 0;
                    }
                }

                button {
                    font-size: 1.2rem;
                    background-color: transparent;
                    border: none;
                    color: royalblue;

                    &:hover {
                        opacity: .8;
                    }

                    &,
                    &:active {
                        opacity: 1;
                    }
                }
            }
        }
    }
}
</style>

<script>
import ExpandBox from './ExpandBox.vue'
import EmojiPicker from './EmojiPicker.vue'
import LoaddingComponent from './LoaddingComponent.vue';
import { mapActions } from 'vuex'
import helper from '../helper'
import messageService from '../services/message.service'
export default {
    emits: ['onInfoClick', 'sendMessage'],
    components: {
        ExpandBox,
        EmojiPicker,
        LoaddingComponent
    },
    props: {
        pFriendChatId: {
            type: String,
            default: undefined
            // required: true
        },
        pNewMessage: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            messages: [],
            text: '',
            openEmojiPicker: false,
            loaded: false,
        }
    },
    computed: {
        accountLogin() {
            return this.$store.state.account
        },
        friendChatId() {
            return this.pFriendChatId
        },
        friendChatAcc() {
            return this.$store.state.accountMap.get(this.friendChatId)
        },
        newMessage() {
            return this.pNewMessage
        }
    },
    methods: {
        ...mapActions(['pushToAccountMap', 'createAndSendMessage', 'socketSendMessageToFriendChat']),

        fullName: helper.fullName,

        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },

        getDateTime(dateTimeString) {
            const date = new Date(dateTimeString)
            return date.toLocaleString()
        },

        scrollToLastMessage() {
            const element = document.getElementById('hidden-item')
            element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        },

        openOrCloseSideBarRight() {
            this.$emit('onInfoClick')
        },

        openOrCloseEmojiPicker() {
            this.openEmojiPicker = !this.openEmojiPicker
        },

        selectEmojiHandle({ icon }) {
            this.text += icon
        },

        debounce() {
            clearTimeout(this.timeOutId)
            this.timeOutId = setTimeout(async () => {
                const isImage = await helper.isImgUrl(this.text)
                if (isImage) {
                    this.$refs['img'].height = 120
                    this.$refs['img'].src = this.text
                    this.scrollToLastMessage()
                }
                else {
                    this.$refs['img'].height = 0
                    this.$refs['img'].src = ''
                }
            }, 620)
        },

        reactMessage({ target }) {
            const parent = target.parentElement
            const message = parent.querySelector('.message')
            if (message.classList.contains('react')) {
                message.classList.remove('react')
            }
            else {
                message.classList.add('react')
            }
        },

        async unsendMessage({ target }) {
            const parent = target.parentElement
            const index = parent.dataset.index
            const message = this.messages[index]

            message.unsend = !message.unsend
            await messageService.updateById(message._id, { unsend: message.unsend })

            // [chưa làm] thông báo thu hồi tin nhắn cho người kia thông qua socket
        },

        responseMessage({ target }) {
            const parent = target.parentElement
            const index = parent.dataset.index
            const message = this.messages[index]
            const fullName = {
                acc1: this.fullName(this.accountLogin),
                acc2: this.fullName(this.friendChatAcc)
            }

            let findTagIndex = this.text.indexOf(`@${fullName.acc1}`)
            let startSlice = 0
            if (findTagIndex === 0) {
                startSlice = fullName.acc1.length + 1
            }
            else {
                findTagIndex = this.text.indexOf(`@${fullName.acc2}`)
                if (findTagIndex === 0) {
                    startSlice = fullName.acc2.length + 1
                }
            }

            if (startSlice != 0) {
                this.text = this.text.slice(startSlice)
            }

            const tag = this.fullName(this.getAccount(message.sender))
            this.text = `@${tag}` + this.text
        },

        resetMessageContent() {
            this.text = ''
        },

        async sendMessage() {
            // tạo object message = {...} trên db
            // tạo thành công thì tiến hành thông báo qua socket
            // [chưa làm] tạo thành công nhưng gửi socket thất bại!!!

            const message = await this.createAndSendMessage({
                sender: this.accountLogin._id,
                receipient: this.friendChatId,
                text: this.text
            })

            if (message !== null) {
                // render lại dữ liệu hiển thị
                this.messages.push(message)
                // XEM ĐIỀU CHỈNH LẠI CHỖ NÀY
                // this.loadPreviewLastMessage()
                this.$emit('sendMessage')

                // gửi dữ liệu qua socket
                this.socketSendMessageToFriendChat(message)
                this.resetMessageContent()
            }
        },

        async loadMessages() {
            return await messageService.getAllMessage(this.accountLogin._id, this.friendChatId)
        },

        async initData() {
            this.loaded = false
            if (this.friendChatId) {
                if (this.friendChatAcc === undefined) {
                    await this.pushToAccountMap([this.friendChatId])
                }

                this.messages = await this.loadMessages()
            }
            this.loaded = true
        }
    },
    watch: {
        async pFriendChatId() {
            await this.initData()
        },
        pNewMessage() {
            console.log(this.newMessage)
            if (this.newMessage !== null) {
                this.messages.push(this.newMessage)
            }
        }
    },
    async created() {
        await this.initData()
    },
    mounted() {
        this.scrollToLastMessage()
    },
    updated() {
        this.scrollToLastMessage()
    }
}
</script>

