<template>
    <div class="header-component">
        <div class="left">
            <router-link :to="{ name: 'home' }" title="goto home">
                <i class="fa-solid fa-house router-link-ico"></i>
            </router-link>

            <router-link :to="{ name: 'contact-book' }" title="goto contact book">
                <i class="fa-solid fa-address-book router-link-ico"></i>
            </router-link>

            <router-link :to="{ name: 'chat-room' }" title="goto chat room">
                <i class="fa-regular fa-message router-link-ico"></i>
            </router-link>

            <span class="dropdown-box" @click="showNotifyDropdown">
                <i class="fa-solid fa-bell"></i>
                <div class="notify-number" v-show="notifyNumber > 0">{{ notifyNumber }}</div>

                <div class="background" :class="{ 'show': openDropdown }"></div>

                <DropdownComponent class="dropdown-component dropdown" :pOpen="openDropdown">
                    <template v-slot:default>

                        <template v-if="notifyList.length > 0">
                            <ul class="notify-list">
                                <li class="notify" v-for="notify in notifyList" :key="notify._id">
                                    <!-- <router-link :to="`/post/${notify.postId}`"> -->
                                    <router-link :to="{ name: 'post', params: { 'id': notify.postId } }">
                                        <img class="avatar" :src="getAccountMap(notify.accountId).avatar" alt="...">

                                        <p class="content">
                                            <template v-if="notify.type === 'comment'">
                                                <b>{{ fullName(accountMap.get(notify.accountId) ) }}</b> vừa <b>comment
                                                    bài
                                                    viết</b> của bạn
                                            </template>
                                            <template v-else>
                                                <b>{{ fullName(accountMap.get(notify.accountId) ) }}</b> vừa
                                                <b>thích</b>
                                                bài
                                                viết
                                                của bạn
                                            </template>
                                        </p>
                                    </router-link>
                                </li>
                            </ul>
                        </template>

                        <template v-else>
                            <div class="no-have-notify">
                                Không có thông báo
                            </div>
                        </template>

                    </template>
                </DropdownComponent>
            </span>

            <span @click="logOutAccount" title="log out">
                <i class="fa-solid fa-right-from-bracket"></i>
            </span>
        </div>

        <!-- <router-link class="right" :to="`/profile/${loginAccount._id}`"> -->
        <router-link class="right" :to="{ name: 'profile', params: { 'id': loginAccount._id } }">
            <p class="name">{{ fullName(loginAccount) }}</p>
            <img :src="loginAccount.avatar">
        </router-link>
    </div>
</template>


<script>
import { mapActions } from 'vuex'
import helper from '../helper'
import commentService from '../services/comment.service'
import DropdownComponent from './DropdownComponent.vue'
import audioFile from '../assets/mp3/relax-message-tone.mp3'
export default {
    components: {
        DropdownComponent
    },
    data() {
        return {
            openDropdown: false,
            notifyList: [],
            notifyNumber: 0
        }
    },
    computed: {
        loginAccount() {
            return this.$store.state.account
        },
        accountMap() {
            return this.$store.state.accountMap
        }
    },
    methods: {
        ...mapActions(['userOffline', 'pushToAccountMap']),

        fullName: helper.fullName,

        getAccountMap(accId) {
            return this.$store.state.accountMap.get(accId)
        },

        showNotifyDropdown() {
            this.openDropdown = !this.openDropdown

            if (this.openDropdown) {
                this.notifyNumber = 0
            }
        },
        async logOutAccount() {
            localStorage.removeItem('chatweb-accid')

            this.$store.state.socket.disconnect()
            this.$store.state.socket = null

            await this.userOffline()

            this.$router.push({ name: 'login' })
            // window.open('/login', '_self')
        },
    },
    mounted() {
        this.$store.state.socket.on('receive-comment', async (commentId, postId) => {
            const cmt = await commentService.getCommentId(commentId)
            cmt.type = 'comment'
            cmt.postId = postId

            if (!this.accountMap.has(cmt.accountId)) {
                await this.pushToAccountMap([cmt.accountId])
            }

            this.notifyList.push(cmt)
            this.notifyNumber++
        })
        this.$store.state.socket.on('receive-like-post', async (accountId, postId) => {
            if (!this.accountMap.has(accountId)) {
                await this.pushToAccountMap([accountId])
            }

            this.notifyList.push({ accountId, postId, type: 'like-post' })
            this.notifyNumber++
        })
    },
    watch: {
        notifyNumber() {
            if (this.notifyNumber !== 0) {
                const audio = new Audio(audioFile)
                audio.play()
                    .catch(err => console.log(err))
            }
        }
    }
}
</script>



<style lang="scss" scoped>
.no-have-notify {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 20px;
    height: 100%;
}

.dropdown-box {
    position: relative;

    .notify-number {
        position: absolute;
        top: 0;
        right: 0;
        border-radius: 50%;
        color: white;
        background-color: rgba(95, 158, 160, 0.815);
        font-size: 60%;

        --size: 14px;
        width: var(--size);
        height: var(--size);
        line-height: var(--size);
        text-align: center;
    }

    .background {
        display: none;

        &.show {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 1;
            background-color: transparent;
        }
    }

    &>.dropdown {
        position: absolute;
        top: calc(100% + 3px);
        left: -20px;

        box-shadow: 1px 3px 10px rgb(94, 94, 94);
        background-color: #242526;
        color: rgb(192, 192, 192);
        width: 300px;
        height: 200px;
        z-index: 1;

        --arrow-x: 20px;
        --arrow-color: #242526;

        .notify-list {
            max-height: 100%;
            overflow-y: auto;
            display: flex;
            flex-direction: column-reverse;

            /* width */
            &::-webkit-scrollbar {
                width: 10px;
            }

            /* Track */
            &::-webkit-scrollbar-track {
                // background: #f1f1f1;
            }

            /* Handle */
            &::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;

            }

            /* Handle on hover */
            &::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            .notify {
                // margin: 3px 0;
                padding: 3px 5px;
                background-color: #242526;

                &:hover {
                    background-color: rgba(75, 75, 75, 0.616);
                    color: #fff;
                }

                &>a {
                    display: flex;

                    .avatar {
                        --size: 28px;
                        width: var(--size);
                        height: var(--size);
                        border-radius: 50%;
                    }

                    .content {
                        margin-left: 3px;
                    }
                }
            }
        }
    }
}

.header-component {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    align-items: center;

    .left {

        .router-link-ico,
        .fa-bell,
        .fa-right-from-bracket {
            padding: 6px;
            font-size: 18px;
            cursor: pointer;
        }
    }

    .right {
        display: flex;
        --img-size: 50px;

        .name {
            display: inline-block;
            line-height: var(--img-size);
            font-weight: bold;
            margin-right: 5px;
        }

        img {
            width: var(--img-size);
            height: var(--img-size);
            border-radius: 50%;
        }
    }

}
</style>