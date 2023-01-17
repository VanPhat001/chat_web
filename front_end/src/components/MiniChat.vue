<template>
    <div ref="mini-chat" class="mini-chat animation-show">

        <div class="box-info">
            <div class="row">
                <div class="col">
                    <img class="avatar"
                        :src="accountMap.get(userInfo.userLeftId).avatar">
                    <p class="name">{{ 'ten user' }}</p>
                </div>
                <div class="col col-right">
                    <div class="btn btn-close" @click="closeHandle">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="box-chat">
            <div class="row" v-for="mess in messages">
                <div class="col" :class="{
                    'col-left': userInfo.userLeftId == mess.sender,
                    'col-right': userInfo.userRightId == mess.sender
                }">
                    <img class="avatar" :src="accountMap.get(mess.sender).avatar">

                    <template v-if="mess.content.text">
                        <p class="content content-text">{{ mess.content.text }}</p>
                    </template>
                    <template v-else>
                        <img class="content content-image" :src="mess.content.image">
                    </template>

                </div>
            </div>

            <div ref="last-row-hidden"></div>
        </div>

        <div class="box-send-message">
            <div class="row">
                <div class="col col-fill">
                    <input type="text" @keydown.enter.prevent="sendMessage" v-model="text">
                </div>
                <div class="col">
                    <button @click="sendMessage">send</button>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
import messageService from '../services/message.service'
import { mapActions } from 'vuex'
import audioFile from '../assets/mp3/pristine-609 (mp3cut.net).mp3'
export default {
    emits: ['close'],
    props: {
        pUserInfo: {
            userLeftId: null,
            userRightId: null
        }
    },
    data() {
        return {
            messages: [],
            text: '',
            stopReceiveMessage: false
        }
    },
    computed: {
        userInfo() {
            return this.pUserInfo
        },
        accountMap() {
            return this.$store.state.accountMap
        }
    },
    methods: {
        ...mapActions(['pushToAccountMap', 'socketSendMessageToFriendChat', 'createAndSendMessage']),

        closeHandle() {
            this.$refs['mini-chat'].classList.add('animation-close')

            // đợi sau khi animation-close kết thúc (trong 0.7s) thì
            // gửi thông tin sự kiện close cho parent
            setTimeout(() => {
                this.$emit('close')
            }, 700)
        },

        scrollToLastMessage() {
            const el = this.$refs['last-row-hidden']
            el.scrollIntoView({ behavior: "smooth", inline: "nearest" });
        },

        async receiveMessage() {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
            const receiveMessageQueue = this.$store.state.receiveMessageQueue

            while (!this.stopReceiveMessage) {

                let check = false
                while (receiveMessageQueue.length > 0) {
                    const message = receiveMessageQueue.shift()
                    this.messages.push(message)
                    check = true
                }

                // this.$refs['audio'].src = `@\assets\mp3\pristine-609 (mp3cut.net).mp3`
                // this.$refs['audio'].play()
                if (check) {
                    const audio = new Audio(audioFile);
                    audio.play()
                }

                await delay(1500)
            }
        },

        async sendMessage() {
            const message = await this.createAndSendMessage({
                sender: this.userInfo.userRightId,
                receipient: this.userInfo.userLeftId,
                text: this.text,
            })

            if (message !== null) {
                this.messages.push(message)
                await this.socketSendMessageToFriendChat(message)
                this.text = ''
            }
        }
    },
    async created() {
        try {
            await this.pushToAccountMap([this.userInfo.userLeftId, this.userInfo.userRightId])
            this.messages = await messageService.getAllMessage(this.userInfo.userLeftId, this.userInfo.userRightId)

            this.receiveMessage()
        } catch (error) {
            console.log(error)
        }
    },
    updated() {
        this.scrollToLastMessage()
    },
    unmounted() {
        this.stopReceiveMessage = true
    },
}
</script>



<style lang="scss" scoped>
.avatar {
    --image-size: 36px;
    width: var(--image-size);
    height: var(--image-size);
    border-radius: 50%;
}

.row {
    display: flex;

    &>.col {
        display: flex;

        &.col-fill {
            flex: 1;
        }

        &.col-left {
            margin-right: auto;
        }

        &.col-right {
            margin-left: auto;
        }
    }
}

.mini-chat {
    width: 350px;
    height: 460px;
    max-height: 70vh;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.616);


    display: flex;
    flex-direction: column;

    .box-info {
        background-color: #146dd3;
        color: white;
        padding: 6px;

        .row {
            .col {
                align-items: center;

                .name {
                    font-weight: bold;
                    margin-left: 4px;
                    font-size: 17px;
                }

                .btn-close {
                    font-size: 24px;
                    margin-right: 6px;

                    &:hover {
                        opacity: 1;
                    }

                    &,
                    &:active {
                        opacity: .8;
                    }
                }
            }

        }


    }

    .box-chat {
        flex: 1;
        overflow-y: auto;
        padding: 4px 0;

        .col-right {
            flex-direction: row-reverse;
        }

        .row+.row {
            margin-top: 2px;
        }

        .row:has(.col-left)+.row .col-left,
        .row:has(.col-right)+.row .col-right {
            .avatar {
                opacity: 0;
            }
        }

        .avatar {
            // --image-size: 36px;
        }

        .content {
            max-width: 70%;
            padding: 5px;
            border-radius: 5px;
        }

        .col-left {
            .content {
                background-color: gainsboro;
            }
        }

        .col-right {
            .content {
                background-color: var(--color-2);
            }
        }
    }

    .box-send-message {
        input {
            width: 100%;
            border: 1px solid gray;
            padding: 0 6px;

            &:focus {
                border-color: blue;
            }
        }

        button {
            font-size: 16px;
            padding: 4px 12px;
        }
    }
}

.animation-show {
    animation: animation-show 700ms 1 both;
}

.animation-close {
    animation: animation-close 700ms 1 both;
}

@keyframes animation-show {
    from {
        height: 0;
    }
}

@keyframes animation-close {
    to {
        height: 0;
    }
}
</style>