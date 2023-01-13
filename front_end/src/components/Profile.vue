<template>
    <div class="profile">
        <LoaddingComponent></LoaddingComponent>

        <!-- <h1>profile</h1>
        <p>{{ userProfile }}</p> -->

        <div class="user">
            <img class="avatar" :src="userProfile?.avatar">
            <div>
                <p class="name">{{ fullName(userProfile) }}</p>

                <div>
                    <div class="mutual-friends">
                        <!-- {{ mutualFriends }} -->
                        <router-link v-for="accId in mutualFriends" :key="accId" :to="`/profile/${accId}`">
                            <img :src="getAccount(accId).avatar" :title="fullName(getAccount(accId))">
                        </router-link>
                    </div>
                    <template v-if="profileType !== ROLE.USER">
                        <button class="btn btn-friend dropdown-box" v-if="profileType === ROLE.FRIEND">
                            <i class="fa-solid fa-user-check"></i>
                            Bạn bè

                            <DropdownComponent class="dropdown-component dropdown">
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
                        <button class="btn btn-chat" @click="clickHandle">
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

    </div>
</template>

<script>
import friendService from '../services/friend.service'
import PostList from './PostList.vue'
import DropdownComponent from './DropdownComponent.vue'
import LoaddingComponent from './LoaddingComponent.vue'
import { mapActions } from 'vuex'


export default {
    components: {
        PostList,
        DropdownComponent,
        LoaddingComponent
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
        return {
            userProfile: null,
            mutualFriends: [],

            ROLE: Object.freeze({
                USER: 'user',
                FRIEND: 'friend',
                REQUEST: 'request',
                REQUESTED: 'requested',
                OTHER: 'other'
            }),
            profileType: 'user',
            loadedCounter: 0
        }
    },
    methods: {
        ...mapActions(['pushToAccountMap']),
        incCounter() {
            this.loadedCounter++

            const loadding = document.querySelector('.loadding-component')
            loadding?.remove()
        },
        fullName(account) {
            if (account)
                return `${account.lastName} ${account.firstName}`
            return ''
        },
        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },
        clickHandle() {
            alert('chưa code')
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
                    // [chưa làm] nếu isAccept === false ---> người lạ
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

.user {
    display: flex;
    align-items: flex-end;
    padding: 0 8%;
    margin-top: 20px;

    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    div {
        flex: 1;

        .name {
            font-weight: bold;
            font-size: 28px;
            margin-left: 8px;
        }

        div {
            display: flex;

            .mutual-friends {
                margin-right: auto;

                img {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                }
            }

            button {
                color: white;
                font-size: 15px;
                font-weight: bold;
                border: none;
                border-radius: 6px;

                outline: none;
                padding: 8px 24px;
                opacity: .8;

                &:hover {
                    opacity: 1;
                }

                &:not(:first-child) {
                    margin-left: 3px;
                }

                &.btn-friend {
                    background-color: rgb(172, 177, 176);
                }

                &.btn-edit-account,
                &.btn-cancel-request,
                &.btn-add-friend,
                &.btn-chat {
                    background-color: rgb(20, 109, 211);
                }
            }
        }
    }

}
</style>