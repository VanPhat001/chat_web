<template>
    <div ref="mini-chat" class="mini-chat animation-show">

        <div class="box-info">
            <div class="row">
                <div class="col">
                    <img class="avatar"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3HRBBRWCcgKjir6au_unzo38eWA_hC9S3-Mf8NYQpKQ85u9PZX4IK_RtInadQ2Vycj8&usqp=CAU">
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
                    <input type="text" @keydown.enter.prevent="sendMessage">
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
import { mapActions } from 'vuex';
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
            messages: []
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
        ...mapActions(['pushToAccountMap']),

        closeHandle() {
            this.$refs['mini-chat'].classList.add('animation-close')

            // đợi sau khi animation-close kết thúc (trong 1s) thì
            // gửi thông tin sự kiện close cho parent
            setTimeout(() => {
                this.$emit('close')
            }, 1000)
        },
        
        scrollToLastMessage() {
            const el = this.$refs['last-row-hidden']
            el.scrollIntoView({ behavior: "smooth", inline: "nearest" });
        },

        sendMessage() {
            alert('qua bên chat-room nhắn tin, bên đây chưa code :)')
        }
    },
    async created() {
        try {
            await this.pushToAccountMap([this.userInfo.userLeftId, this.userInfo.userRightId])
            this.messages = await messageService.getAllMessage(this.userInfo.userLeftId, this.userInfo.userRightId)
        } catch (error) {
            console.log(error)
        }
    },
    updated() {
        this.scrollToLastMessage()
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
    max-height: 700vh;
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
            img {
                opacity: 0;
            }
        }

        .avatar {
            // --image-size: 36px;
        }

        .content {
            max-width: 70%;
            padding: 5px;
            border-radius: 6px;
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
    animation: animation-show 1000ms 1 both;
}

.animation-close {
    animation: animation-close 1000ms 1 both;
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