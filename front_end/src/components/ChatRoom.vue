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

            <FriendChatList class="friend-chat-list" :pFriendsChatId="friendsChatId" :pLastMessages="lastMessages"
                :pNotifyNumber="notifyNumber" @onSelectFriend="setSelectFriendIndex" />
        </div>

        <ChatBox class="chat-box" :pFriendChatId="selectFriend?._id" :pNewMessage="newMessage" @onInfoClick="openOrCloseSideBarRight" />

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

    .chat-box {
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
import ChatBox from './ChatBox.vue'
import FriendChatList from './FriendChatList.vue';
import messageService from '../services/message.service'
import accountService from '../services/account.service'
import { mapGetters, mapActions } from 'vuex'
import helper from '../helper'
import audioFile from '../assets/mp3/pristine-609 (mp3cut.net).mp3'

export default {
    components: {
        AccountList,
        LoaddingComponent,
        ChatBox,
        FriendChatList
    },
    data() {
        return {
            friendsChatId: [],
            notifyNumber: [],
            findAccounts: [],
            lastMessages: [],
            selectFriendIndex: 0,
            loadedCounter: 0,
            text: '',
            findAccountText: '',
            stopReceiveMessage: false,
            openEmojiPicker: false,
            newMessage: null,
            timeOutId: null,
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
                const data = await messageService.getAllMessage(this.accountLogin._id, this.selectFriend._id)
                this.messages = data
                this.notifyNumber[index] = 0
            } catch (error) {
                console.log(error)
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
                        // this.messages.push(message)

                        this.newMessage = message
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

                await delay(2000)
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

        closeImageFullScreen() {
            this.$refs['image-box'].classList.add('close')
        },

        openImageFullScreen(imgLink) {
            this.$refs['image-show'].src = imgLink
            this.$refs['image-box'].classList.remove('close')
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
    },

    async created() {
        const accountId = this.account._id
        try {
            // get friends chat id array ===> [ accountId ]
            const friendsChatIdData = await messageService.getFriendsChat(accountId)
            console.log(friendsChatIdData)

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

    unmounted() {
        this.stopReceiveMessage = true
    }
}
</script>