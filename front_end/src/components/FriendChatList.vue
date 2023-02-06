<template>
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

                    <p class=text v-if="lastMessages[index].unsend">
                        [Tin nhắn đã thu hồi]
                    </p>

                    <p class="text" v-else>
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
</template>

<style lang="scss" scoped>
.avatar {
    --avatar-size: 54px;
    width: var(--avatar-size);
    height: var(--avatar-size);
    border-radius: 50%;
}

.friend-chat-list {
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
</style>

<script>
export default {
    emits: ['onSelectFriend'],
    props: {
        pFriendsChatId: {
            type: Array,
            default: []
        },
        pLastMessages: {
            type: Array,
            default: []
        },
        pNotifyNumber: {
            type: Array,
            default: []
        }
    },
    computed: {
        friendsChatId() {
            return this.pFriendsChatId
        },
        lastMessages() {
            return this.pLastMessages
        },
        notifyNumber() {
            return this.pNotifyNumber
        },
        accountLogin() {
            return this.$store.state.account
        }
    },
    methods: {
        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },
        setSelectFriendIndex(index) {
            this.$emit('onSelectFriend', index)
        }
    }
}
</script>