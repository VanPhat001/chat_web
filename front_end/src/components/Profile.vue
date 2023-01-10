<template>
    <div class="profile">
        <h1>profile</h1>

        <p>{{ userProfile }}</p>

        <div class="user">
            <img class="avatar" :src="userProfile?.avatar">
            <div>
                <p class="name">{{ fullName(userProfile) }}</p>
                <div v-if="profileType !== ROLE.USER">
                    <button class="btn btn-friend" @click="clickHandle" v-if="profileType === ROLE.FRIEND">
                        <i class="fa-solid fa-user-check"></i>
                        Bạn bè
                    </button>
                    <button class="btn btn-cancel-request" @click="clickHandle" v-if="profileType === ROLE.REQUEST">
                        <i class="fa-solid fa-user-minus"></i>
                        Hủy yêu cầu
                    </button>
                    <button class="btn btn-add-friend" @click="clickHandle"
                        v-if="profileType === ROLE.OTHER || profileType === ROLE.REQUESTED">
                        <i class="fa-solid fa-user-plus"></i>
                        Thêm bạn bè
                    </button>
                    <button class="btn btn-chat" @click="clickHandle">
                        <i class="fa-solid fa-message"></i>
                        Nhắn tin
                    </button>
                </div>
                <div v-else>
                    <button class="btn btn-edit-account" @click="clickHandle">
                        Chỉnh sửa thông tin
                    </button>
                </div>
            </div>
        </div>

        <PostList :pUserId="$route.params.id"></PostList>

    </div>
</template>

<script>
import accountService from '../services/account.service'
import postService from '../services/post.service'
import friendService from '../services/friend.service'
import PostList from './PostList.vue'


export default {
    components: {
        PostList
    },
    computed: {
        userLogin() {
            return this.$store.state.account
        }
    },
    data() {
        return {
            userProfile: null,
            // isFriend = false, khi trang profile hiển thị thông tin của người lạ
            // isFriend = true, khi trang profile hiển thị thông tin của bạn bè
            // isFriend = null, khi trang profile hiển thị thông tin của người đăng nhập
            // isFriend: null,

            ROLE: Object.freeze({
                USER: 'user',
                FRIEND: 'friend',
                REQUEST: 'request',
                REQUESTED: 'requested',
                OTHER: 'other'
            }),
            profileType: 'user'
        }
    },
    methods: {
        fullName(account) {
            if (account)
                return `${account.lastName} ${account.firstName}`
            return ''
        },
        clickHandle() {
            alert('chưa code')
        }
    },
    async created() {
        const id = this.$route.params.id
        const accountMap = this.$store.state.accountMap

        if (!accountMap.has(id)) {
            const account = await accountService.getById(id)
            accountMap.set(account._id, account)
        }

        this.userProfile = accountMap.get(id)
        const posts = await postService.getByAuthor(id)

        console.log(posts)


        // thí.isFriend = null // default value
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
        }
    }
}
</script>

<style lang="scss" scoped>
.user {
    display: flex;
    align-items: center;
    padding: 0 30px;

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
            text-align: right;

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