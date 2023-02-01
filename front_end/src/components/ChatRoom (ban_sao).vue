<template >
    <div class="chat-room">

        <LoaddingComponent></LoaddingComponent>

        <div ref='model' class="model hide">
            <div class="background" @click="hideModel"></div>
            <AccountList class="account-list" :pAccounts="findAccounts" @selectAccount="selectAccountHandle"
                @loaded="incCounter">
            </AccountList>
        </div>

        <div class="sidebar sidebar-left">
            <div class="friend-chat-find">
                <input type="text" placeholder="Nhập tên hoặc id tài khoản" v-model="findAccountText"
                    @keyup.enter="findAccountByNameOrId">
                <button @click="findAccountByNameOrId">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>

            <ul class="friend-chat-list">
                <li class="friend-chat" v-for="(friendId, index) in friendsChatId" :key="index"
                    @click="setSelectFriendIndex(index)">
                    <span class="avatar-box">
                        <img class="avatar" :src="getAccount(friendId).avatar">
                        <div v-show="getAccount(friendId).timeLastActive === null" class="active"></div>
                    </span>
                    <div class="info">
                        <p class="name">{{ getAccount(friendId).lastName + ' ' + getAccount(friendId).firstName }}</p>
                        <template
                            v-if="index < lastMessages.length && lastMessages[index] !== undefined && lastMessages[index].content">
                            <p class="text">
                                <span v-if="lastMessages[index].sender == accountLogin._id">Bạn: </span>
                                <span v-if="lastMessages[index].content.text">{{
                                    lastMessages[index].content.text
                                }}</span>
                                <span v-else>[hình ảnh]</span>
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
                <template v-if="selectFriendIndex < friendsChatId.length">
                    <img class="avatar" :src="selectFriend.avatar">
                    <router-link :to="{ name: 'profile', params: { 'id': selectFriend._id } }">
                        <p class="name">{{ `${selectFriend.lastName} ${selectFriend.firstName}` }}</p>
                    </router-link>

                    <span class="btn btn-info" @click="openOrCloseSideBarRight">
                        <i class="fa-solid fa-info"></i>
                    </span>
                </template>
            </div>

            <div class="chat-box">
                <div :class="{ 'message-info': true, 'right': message.sender === accountLogin._id, 'left': message.sender === selectFriend._id }"
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
                        <img class="avatar" :src="selectFriend.avatar">

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
                            <EmojiPicker v-show="openEmojiPicker" class="emoji-picker"
                                @onSelectEmoji="selectEmojiHandle"></EmojiPicker>

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

        <div ref="sidebar-right" class="sidebar sidebar-right animation-close">
            <template v-if="selectFriend">
                <img class="avatar" :src="selectFriend.avatar">
                <router-link class="name" :to="{ name: 'profile', params: { 'id': selectFriend._id } }">
                    {{ fullName(selectFriend) }}
                </router-link>

                <table>
                    <tr>
                        <th>ID</th>
                        <td>{{ selectFriend._id }}</td>
                    </tr>
                    <tr>
                        <th>Họ</th>
                        <td>{{ selectFriend.lastName }}</td>
                    </tr>
                    <tr>
                        <th>Tên</th>
                        <td>{{ selectFriend.firstName }}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{{ selectFriend.email ? selectFriend.email : '<chưa cập nhập>' }}</td>
                    </tr>
                    <tr>
                        <th>Giới tính</th>
                        <td>{{ convertGenderToString(selectFriend.gender) }}</td>
                    </tr>
                    <tr>
                        <th>Địa chỉ</th>
                        <td>{{ selectFriend.address ? selectFriend.address : '<chưa cập nhật>' }}</td>
                    </tr>
                </table>

            </template>

            <template v-else>
                Chưa có dữ liệu
            </template>
        </div>

        <div ref="image-box" class="image-box close">
            <div class="background-fullscreen" @click="closeImageFullScreen"></div>
            <img ref="image-show" src="https://cf.shopee.vn/file/e78672db6328f6c20b1c407a7b92c676_tn">
        </div>

    </div>
</template>


<style lang="scss" scoped>
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


.pos-relative {
    position: relative;
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

.hide,
.close {
    display: none !important;
}

.chat-room {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    background-color: #242526;
    color: rgb(202, 201, 201);

    .sidebar {
        width: 265px;
    }

    .sidebar-left {}

    .main-box {
        flex: 1;
    }

    .sidebar-right {}
}

.animation-open {
    animation: open 250ms 1 linear both;
}

@keyframes open {
    from {
        width: 0;
    }
}

.animation-close {
    animation: close 250ms 1 linear both;
}

@keyframes close {
    to {
        width: 0;
    }
}

.image-box {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;

    .background-fullscreen {
        position: fixed;
        inset: 0;
        z-index: -1;
        background-color: rgba(0, 0, 0, 0.801);
    }

    .image-show {
        max-width: 75%;
        max-height: 75%;
    }
}

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

.sidebar-left {
    --find-friend-input-height: 36px;
    --friend-chat-padding-top-bottom: 16px;
    border: 1px solid rgb(65, 65, 65);

    .friend-chat-find {
        position: relative;
        padding: var(--friend-chat-padding-top-bottom) 0;

        input {
            height: var(--find-friend-input-height);
            border-radius: var(--find-friend-input-height);
            border: 2px solid transparent;
            background-color: rgb(73, 73, 73);
            color: rgb(216, 216, 216);
            width: 96%;
            margin: 0 2%;
            padding: 0 32px 0 12px;
            font-size: 16px;

            &:focus {
                border-color: lightgray;
            }
        }

        button {
            position: absolute;
            top: 50%;
            right: 2%;
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
        height: calc(100% - var(--find-friend-input-height) + calc(-1) * 2 * var(--friend-chat-padding-top-bottom));
        overflow-y: auto;

        .friend-chat {
            display: flex;
            margin-top: 12px;

            &:hover {
                background-color: rgb(82, 82, 82);
                cursor: pointer;
            }

            .avatar-box {
                position: relative;

                .avatar {
                    margin: 0 8px;
                }

                .active {
                    position: absolute;
                    bottom: 3px;
                    right: 8px;
                    width: 16px;
                    height: 16px;
                    background-color: rgba(70, 236, 84, 0.842);
                    border-radius: 50%;
                }
            }

            .info {
                flex: 1;
                position: relative;

                .name {
                    width: 100%;
                    font-weight: bold;
                    font-size: 16px;
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

.main-box {
    display: flex;
    flex-direction: column;

    .receipient-bar {
        display: flex;
        align-items: center;
        padding: 4px 10px;
        border: 1px solid rgb(65, 65, 65);

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
            background-color: royalblue;
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
        padding: 0 8px;
        overflow-y: auto;

        .message-info {
            display: flex;
            width: 66%;
            margin-top: 1px;

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

.sidebar-right {
    border: 1px solid rgb(65, 65, 65);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    padding-top: 10px;

    .avatar {
        width: 120px;
        height: 120px;
    }

    .name {
        font-weight: bold;
        color: #fff;
        font-size: 24px;

        &:hover {
            opacity: 1;
        }

        &,
        &:active {
            opacity: .88;
        }
    }

    table {
        margin-top: 16px;

        th {
            text-align: left;
            padding-right: 6px;
        }
    }
}
</style>


<script>
import AccountList from './AccountList.vue'
import LoaddingComponent from './LoaddingComponent.vue'
import EmojiPicker from './EmojiPicker.vue'
import ExpandBox from './ExpandBox.vue';
import messageService from '../services/message.service'
import accountService from '../services/account.service'
import { mapGetters, mapActions } from 'vuex'
import helper from '../helper'
import audioFile from '../assets/mp3/pristine-609 (mp3cut.net).mp3'

export default {
    components: {
        AccountList,
        LoaddingComponent,
        EmojiPicker,
        ExpandBox
    },
    data() {
        return {
            friendsChatId: [],
            notifyNumber: [],
            selectFriendIndex: 0,
            messages: [],
            text: '',
            findAccountText: '',
            findAccounts: [],
            lastMessages: [],
            stopReceiveMessage: false,
            loadedCounter: 0,
            timeOutId: null,
            openEmojiPicker: false
        }
    },

    computed: {
        ...mapGetters(['account']),
        GENDER() {
            return this.$store.state.GENDER
        },
        selectFriend() {
            return this.getAccount(this.friendsChatId[this.selectFriendIndex])
        },
        accountLogin() {
            return this.account
        },
        accountMap() {
            return this.$store.state.accountMap
        }
    },

    methods: {
        ...mapActions(['socketSendMessageToFriendChat', 'createAndSendMessage']),

        fullName: helper.fullName,

        convertGenderToString(gender) {
            switch (gender) {
                case this.GENDER.MALE:
                    return 'Nam'

                case this.GENDER.FEMALE:
                    return 'Nữ'

                case this.GENDER.OTHER:
                    return 'Khác'

                default:
                    return '<chưa cập nhật>'
            }
        },

        incCounter() {
            this.loadedCounter++

            if (this.loadedCounter == 2) {
                try {
                    const loadding = document.querySelector('.loadding-component')
                    loadding.remove()
                } catch (error) {
                    console.log(error)
                }
            }
        },

        getAccount(accId) {
            return this.accountMap.get(accId)
        },

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
            // tạo object message = {...} trên db
            // tạo thành công thì tiến hành thông báo qua socket
            // [chưa làm] tạo thành công nhưng gửi socket thất bại!!!

            const message = await this.createAndSendMessage({
                sender: this.accountLogin._id,
                receipient: this.selectFriend._id,
                text: this.text
            })

            if (message !== null) {
                // render lại dữ liệu hiển thị
                this.messages.push(message)
                this.loadPreviewLastMessage()

                // gửi dữ liệu qua socket
                this.socketSendMessageToFriendChat(message)
                this.resetMessageContent()
            }
        },

        async receiveMessage() {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
            const receiveMessageQueue = this.$store.state.receiveMessageQueue

            // console.log('>> start receive message');
            while (!this.stopReceiveMessage) {

                // duyệt qua toàn bộ mảng receiveMessageQueue, xử lí từng thông điệp và loại bỏ nó ra khỏi mảng
                // sau khi làm xong thì nghỉ 1s và duyệt lại từ đầu
                let check = false
                while (receiveMessageQueue.length > 0) {
                    const message = receiveMessageQueue.shift()

                    if (message.sender === this.accountLogin._id) {
                        // BÊN NGƯỜI GỬI TIN NHẮN
                        // thay đổi trạng thái đã gửi thành đã nhận 
                    }
                    else if (message.sender === this.selectFriend?._id) {
                        // BÊN NGƯỜI NHẬN TIN NHẮN, CHAT-ROOM ĐANG HIỂN THỊ TIN NHẮN VỚI NGƯỜI GỬI
                        // hiển thị tin nhắn vừa gửi trên giao diện
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

                        const indexFound = this.friendsChatId.findIndex(accId => accId == friendChat._id)
                        const NOT_FOUND = -1

                        if (indexFound === NOT_FOUND) {
                            this.friendsChatId.push(friendChat._id)
                            this.accountMap.set(friendChat._id, friendChat)
                            this.notifyNumber.push(1)
                        }
                        else {
                            this.notifyNumber[indexFound]++
                        }

                        await this.loadPreviewLastMessage()
                    }

                    check = true
                }

                if (check) {
                    const audio = new Audio(audioFile)
                    audio.play()
                        .catch(err => console.log(err))
                }

                await delay(1500)
            }
            // console.log('>> stop receive message');
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
            this.friendsChatId.forEach(friendId => {
                data.push(map.get(friendId))
            })

            this.lastMessages = data
        },

        hideModel() {
            const modelElement = this.$refs['model']
            modelElement.classList.add('hide')
        },

        selectAccountHandle(index) {
            const account = this.findAccounts[index]

            const result = this.friendsChatId.find(friendId => friendId == account._id)
            const NOT_FOUND = undefined

            if (result === NOT_FOUND) {
                this.friendsChatId.push(account._id)
                this.accountMap.set(account._id, account)
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

        closeImageFullScreen() {
            this.$refs['image-box'].classList.add('close')
        },

        openImageFullScreen(imgLink) {
            this.$refs['image-show'].src = imgLink
            this.$refs['image-box'].classList.remove('close')
        },

        selectEmojiHandle({ icon }) {
            // alert(icon)
            this.text += icon
        },

        openOrCloseEmojiPicker() {
            this.openEmojiPicker = !this.openEmojiPicker
        },

        openOrCloseSideBarRight() {
            const el = this.$refs['sidebar-right']
            if (el.classList.contains('animation-open')) {
                el.classList.remove('animation-open')
                el.classList.add('animation-close')
            }
            else {
                el.classList.remove('animation-close')
                el.classList.add('animation-open')
            }
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
            const senderAcc = this.getAccount(message.sender)
            const receipientAcc = this.getAccount(message.receipient)
            const fullName = {
                acc1: this.fullName(senderAcc),
                acc2: this.fullName(receipientAcc)
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

            this.text = `@${fullName.acc1}` + this.text
        }
    },

    async created() {
        const accountId = this.account._id
        try {
            // get friends chat id array ===> [ accountId ]
            const friendsChatIdData = await messageService.getFriendsChat(accountId)
            console.log(friendsChatIdData);

            // fetch api to get friends chat account  ===> [ {_id, username, password...} ]
            // const getFriendsChatPromises = []
            // friendsChatIdData.forEach(friendId => {
            //     if (!this.accountMap.has(friendId)) {
            //         getFriendsChatPromises.push(accountService.getById(friendId))
            //     }
            // })

            const accIdList = []
            friendsChatIdData.forEach(friendId => {
                if (!this.accountMap.has(friendId)) {
                    accIdList.push(friendId)
                }
            })

            // const data = await Promise.all(getFriendsChatPromises)
            const data = await accountService.getMany(accIdList)
            for (let i = 0; i < data.length; i++) {
                const acc = data[i]
                this.accountMap.set(acc._id, acc)
            }

            for (let i = 0; i < friendsChatIdData.length; i++) {
                this.notifyNumber.push(0)
                this.lastMessages.push({})
            }

            this.friendsChatId = friendsChatIdData
            // await this.loadPreviewLastMessage()
            // await this.setSelectFriendIndex(this.selectFriendIndex)

            await Promise.all([
                this.loadPreviewLastMessage(),
                this.setSelectFriendIndex(this.selectFriendIndex)
            ])

            // lắng nghe dữ liệu trả về từ socket
            this.receiveMessage()
        } catch (error) {
            console.log(error)
        }

        this.incCounter()
    },

    mounted() {
        this.scrollToLastMessage()
    },

    updated() {
        this.scrollToLastMessage()
    },

    unmounted() {
        this.stopReceiveMessage = true
    }
}
</script>