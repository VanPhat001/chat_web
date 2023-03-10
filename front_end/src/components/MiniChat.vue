<template>
    <div ref="mini-chat" class="mini-chat animation-show">

        <div class="box-info">
            <div class="row">
                <div class="col">
                    <span class="image-box">
                        <img class="avatar" :src="accountMap.get(userInfo.userLeftId).avatar">
                        <div :class="{ 'active': accountMap.get(userInfo.userLeftId).timeLastActive === null }"></div>
                    </span>
                    <p class="name">{{ fullName(accountMap.get(userInfo.userLeftId)) }}</p>
                </div>
                <div class="col col-right">
                    <div class="btn btn-info" @click="infoHandle">
                        <i class="fa-solid fa-info"></i>
                    </div>
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
                    <div class="input-box">
                        <input type="text" @keydown.enter.prevent="sendMessage" v-model="text"
                            placeholder="Enter to submit">

                        <div class="emoji-picker-box">
                            <EmojiPicker v-show="openEmojiPicker" class="emoji-picker" @onSelectEmoji="selectEmoji">
                            </EmojiPicker>

                            <button class="btn btn-emoji" @click="openOrCloseEmojiPicker">
                                <i class="fa-solid fa-face-laugh-squint"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <button class="btn btn-send" @click="sendMessage">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
import EmojiPicker from './EmojiPicker.vue'
import messageService from '../services/message.service'
import { mapActions } from 'vuex'
import audioFile from '../assets/mp3/pristine-609 (mp3cut.net).mp3'
import helper from '../helper'
export default {
    emits: ['close'],
    components: {
        EmojiPicker
    },
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
            stopReceiveMessage: false,
            openEmojiPicker: false
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

        fullName: helper.fullName,

        infoHandle() {
            alert('V??o chat-room ????? tr???i nghi???m nhi???u t??nh n??ng h??n...')
        },

        closeHandle() {
            this.$refs['mini-chat'].classList.add('animation-close')

            // ?????i sau khi animation-close k???t th??c (trong 0.7s) th??
            // g???i th??ng tin s??? ki???n close cho parent
            setTimeout(() => {
                this.$emit('close')
            }, 700)
        },

        selectEmoji({ emoji }) {
            this.text += emoji
        },

        openOrCloseEmojiPicker() {
            this.openEmojiPicker = !this.openEmojiPicker
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

                if (check) {
                    const audio = new Audio(audioFile);
                    audio.play()
                        .catch(err => console.log(err))
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
            this.scrollToLastMessage()
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
.hide {
    display: none;
}

.emoji-picker-box {
    position: relative;

    .emoji-picker {
        position: absolute;
        bottom: 100%;
        right: 3px;
        zoom: .85;
    }
}

.image-box {
    position: relative;

    .active {
        position: absolute;
        bottom: 10%;
        right: 10%;
        z-index: 1;
        transform: translate(25%, 25%);

        --size: 16px;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        background-color: rgba(70, 236, 84, 0.842);
    }
}

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

                .btn-info, .btn-close {
                    &:hover {
                        opacity: 1;
                    }

                    &,
                    &:active {
                        opacity: .8;
                    }
                }
                
                .btn-info {
                    font-size: 12px;
                    margin-right: 8px;
                    border-radius: 50%;
                    background-color: #0b3e79;
                    --size: 23px;
                    width: var(--size);
                    height: var(--size);
                    line-height: var(--size);
                    text-align: center;
                }

                .btn-close {
                    font-size: 22px;
                    margin-right: 6px;
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
        padding: 5px 2px;
        background-color: #146dd3;

        .input-box {
            width: 100%;
            display: flex;
            border-radius: 30px;
            background-color: #fff;

            input {
                flex: 1;
                padding: 0 3px 0 10px;
                background-color: transparent;
                border: none;
            }

            .emoji-picker-box {
                .emoji-picker {
                    box-shadow: 0 0 10px gray;
                    border-radius: 6px;
                }

                .btn-emoji {
                    background-color: transparent;
                    border: none;
                    height: 100%;
                    font-size: 15px;
                    color: #146dd3;

                    &:hover {
                        opacity: 1;
                    }

                    &, &:active {
                        opacity: .8;
                    }
                }
            }
        }


        .btn-send {
            margin-left: 2px;
            --size: 32px;
            width: var(--size);
            height: var(--size);
            line-height: var(--size);
            text-align: center;
            // font-size: 16px;
            border-radius: 20px;
            border: none;
            background-color: white;
            color: #146dd3;
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