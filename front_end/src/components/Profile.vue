<template>
    <div class="profile">
        <LoaddingComponent></LoaddingComponent>

        <div class="user">
            <div class="row">
                <div class="col col-flex-1">
                    <img class="user-background"
                        :src="userProfile?.background">
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <img class="avatar" :src="userProfile?.avatar">
                </div>

                <div class="col col-flex-1">
                    <p class="name">{{ fullName(userProfile) }}</p>
                    <div class="mutual-friends">
                        <!-- {{ mutualFriends }} -->
                        <router-link v-for="accId in mutualFriends" :key="accId"
                            :to="{ name: 'profile', params: { 'id': accId } }">
                            <img :src="getAccount(accId).avatar" :title="fullName(getAccount(accId))">
                        </router-link>
                    </div>
                </div>

                <div class="col col-flex-1">
                    <template v-if="profileType !== ROLE.USER">
                        <button class="btn btn-friend dropdown-box" v-if="profileType === ROLE.FRIEND">
                            <i class="fa-solid fa-user-check"></i>
                            Bạn bè

                            <DropdownComponent class="dropdown">
                                <button class="btn" @click="cancelAddFriendRequest">
                                    <i class="fa-solid fa-user-minus"></i>
                                    Hủy kết bạn
                                </button>
                            </DropdownComponent>

                        </button>
                        <button class="btn btn-cancel-request" @click="cancelAddFriendRequest"
                            v-if="profileType === ROLE.REQUEST">
                            <i class="fa-solid fa-user-minus"></i>
                            Hủy yêu cầu
                        </button>
                        <button class="btn btn-add-friend" @click="addFriend"
                            v-if="profileType === ROLE.OTHER || profileType === ROLE.REQUESTED">
                            <i class="fa-solid fa-user-plus"></i>
                            Thêm bạn bè
                        </button>
                        <button class="btn btn-chat" @click="chatHandle">
                            <i class="fa-solid fa-message"></i>
                            Nhắn tin
                        </button>
                    </template>

                    <template v-else>
                        <button class="btn btn-edit-account" @click="clickHandle">
                            Chỉnh sửa thông tin
                        </button>
                    </template>
                </div>

            </div>
        </div>

        <PostList :pUserId="$route.params.id" @loaded="incCounter"></PostList>

        <template v-if="openMiniChat">
            <MiniChat class="mini-chat" :pUserInfo="miniChatUserData" @close="closeMiniChatHandle"></MiniChat>
        </template>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import friendService from '../services/friend.service'
import PostList from './PostList.vue'
import DropdownComponent from './DropdownComponent.vue'
import LoaddingComponent from './LoaddingComponent.vue'
import MiniChat from './MiniChat.vue'
import helper from '../helper'

export default {
    components: {
        PostList,
        DropdownComponent,
        LoaddingComponent,
        MiniChat
    },
    computed: {
        userLogin() {
            return this.$store.state.account
        },
        profileId() {
            return this.$route.params.id
        }
    },
    data() {
        const role = Object.freeze({
            USER: 'user',
            FRIEND: 'friend',
            REQUEST: 'request',
            REQUESTED: 'requested',
            OTHER: 'other'
        })
        return {
            userProfile: null,
            mutualFriends: [],
            ROLE: role,
            profileType: role.USER,
            loadedCounter: 0,
            openMiniChat: false,
            miniChatUserData: {
                userLeftId: null,
                userRightId: null
            }
        }
    },
    methods: {
        ...mapActions(['pushToAccountMap']),
        incCounter() {
            this.loadedCounter++

            const loadding = document.querySelector('.loadding-component')
            loadding?.remove()
        },
        fullName: helper.fullName,
        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },
        clickHandle() {
            this.$router.push({ name: 'edit-profile' })
        },
        async addFriend() {
            console.log('>> add friend: from', this.userLogin._id, 'to', this.profileId)

            try {
                await friendService.create(this.userLogin._id, this.profileId)
                alert('ok')
                this.profileType = this.ROLE.REQUEST
                this.$forceUpdate()
            } catch (error) {
                console.log(error)
                alert('Có lỗi xảy ra, hãy thực hiện thao tác này sau...')
            }
        },
        async cancelAddFriendRequest() {
            console.log('>> cancel add friend request: from', this.userLogin._id, 'to', this.profileId)

            try {
                await friendService.deleteByAccount(this.userLogin._id, this.profileId)
                alert('ok')
                this.profileType = this.ROLE.OTHER
                this.$forceUpdate()
            } catch (error) {
                console.log(error)
                alert('Có lỗi xảy ra, hãy thực hiện thao tác này sau...')
            }
        },
        chatHandle() {
            // chuẩn bị dữ liệu để gửi cho mini-chat render
            this.miniChatUserData = {
                userLeftId: this.profileId,
                userRightId: this.userLogin._id
            }
            this.openMiniChat = true
        },
        closeMiniChatHandle() {
            this.openMiniChat = false
        }
    },
    async created() {
        const id = this.$route.params.id
        const accountMap = this.$store.state.accountMap
        let mutualFriends = []

        // this.isFriend = null // default value
        // xem profile của người khác (bạn hoặc người lạ)
        if (id != this.userLogin._id) {
            const friendObj = await friendService.getByAccount(id, this.userLogin._id)

            // profile của người lạ
            if (friendObj === '') {
                this.profileType = this.ROLE.OTHER
            }
            // profile của bạn user, có khả năng là người lạ
            // tùy thuộc vào friendObj.isAccept
            else {
                // nếu isAccept === true ---> bạn bè
                if (friendObj.isAccept) {
                    this.profileType = this.ROLE.FRIEND
                }
                else {
                    // [chưa làm] nếu isAccept === true ---> người lạ
                    //   TH1: accountId1 gửi lời mời kết bạn cho accountId2
                    if (this.userLogin._id == friendObj.accountId1) {
                        // userLogin là người gửi request
                        // profile hiển thị nút hủy request
                        this.profileType = this.ROLE.REQUEST
                    }
                    //   TH2: accountId2 gửi lời mời kết bạn cho accountId1
                    else {
                        // userLogin là người nhận request
                        // profile hiển thị thông tin của người lạ
                        this.profileType = this.ROLE.REQUESTED
                    }

                }
            }

            mutualFriends = await friendService.getMutualFriends(id, this.userLogin._id)
            await this.pushToAccountMap(mutualFriends)
        }

        await this.pushToAccountMap([id])

        this.userProfile = accountMap.get(id)
        this.mutualFriends = mutualFriends
        this.incCounter()
    }
}
</script>

<style lang="scss" scoped>
.dropdown-box {
    position: relative;

    &:hover {
        .dropdown {
            display: block;

            button {
                background-color: #3a3b3c;
                color: #fff;
            }
        }
    }

    .dropdown {
        display: none;
        position: absolute;
        top: calc(100% + 1rem);
        left: 10px;
        cursor: auto;

        box-shadow: 0 3px 10px grey;
        width: 200px;
        background-color: #fff;
        --arrow-x: 10px;
        --arrow-color: #fff;

        button {
            color: black;
            width: 100%;
        }
    }
}

.mini-chat {
    position: fixed;
    bottom: 0;
    right: 72px;

    border-radius: 2px 2px 0 0;
    overflow: hidden;
    border: 1px solid #146dd3;
}

.user {
    padding: 0 6%;

    .row {
        display: flex;

        .col.col-flex-1 {
            flex: 1;
        }

        .col.col-flex-2 {
            flex: 2;
        }

        .col.col-flex-3 {
            flex: 3;
        }
    }

    .row:nth-child(1) {
        .col {
            .user-background {
                height: 48vh;
                width: 100%;
                border-radius: 10px;
            }
        }
    }

    .row:nth-child(2) {
        --user-name-height: 44px;
        padding: 0 24px;

        .col {
            .avatar {
                --size: 165px;
                width: var(--size);
                height: var(--size);
                border-radius: 50%;
                margin-top: -28%;
                border: 6px solid #e7ece5;
            }
        }

        .col {
            .name {
                font-weight: bold;
                font-size: 32px;
                height: var(--user-name-height);
                line-height: var(--user-name-height);
            }

            .mutual-friends {
                img {
                    border-radius: 50%;
                    --size: 44px;
                    width: var(--size);
                    height: var(--size);
                }
            }
        }

        .col:has(button) {
            text-align: right;
            padding-top: var(--user-name-height);

            button {
                padding: 8px 20px;
                border: none;
                border-radius: 5px;
                font-size: 16px;

                &+button {
                    margin-left: 4px;
                }

                &.btn-friend {
                    background-color: #3a3b3c;
                    color: white;
                }

                &.btn-cancel-request,
                &.btn-add-friend,
                &.btn-chat,
                &.btn-edit-account {
                    background-color: #2374e1;
                    color: #fff;
                }

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
</style>