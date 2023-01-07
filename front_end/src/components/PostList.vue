<template>
    <div class="post-list">

        <div ref="hidden-item" style="height: 0;"></div>

        <div class="friend-list" ref="friend-list">
            <ul>
                <li class="friend" v-for="friend in friends">
                    <span class="avatar-box">
                        <img class="avatar" :src="getAccount(friend).avatar">
                        <div v-show="getAccount(friend).timeLastActive === null" class="active"></div>
                    </span>

                    <p class="name">{{ fullName(getAccount(friend)) }}</p>
                </li>
            </ul>
        </div>

        <template v-for="post in posts">
            <PostComponent class="post-component" :pPost="post"></PostComponent>
        </template>

        <div class="btn-fixed">
            <router-link class="btn btn-create-post" to="/create-post">
                <i class="fa-solid fa-plus"></i>
            </router-link>
            <button class="btn btn-scroll" @click="scrollToTop">
                <i class="fa-solid fa-angle-up"></i>
            </button>
        </div>

    </div>
</template>



<script>
import PostComponent from './PostComponent.vue'
import postService from '../services/post.service'
import friendService from '../services/friend.service'
import accountService from '../services/account.service'
export default {
    components: {
        PostComponent
    },

    data() {
        return {
            posts: [],
            friends: []
        }
    },

    computed: {
        userLogin() {
            return this.$store.state.account
        }
    },

    methods: {
        scrollToTop() {
            const el = this.$refs['hidden-item']
            el.scrollIntoView({ behavior: "smooth", inline: "nearest" });
        },

        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },

        fullName(account) {
            return `${account.lastName} ${account.firstName}`
        }
    },

    async created() {
        const tasks = [
            postService.getAll(),
            friendService.getAllFriendOfAccount(this.userLogin._id)
        ]
        const [postsData, friendsData] = await Promise.all(tasks)

        const accountMap = this.$store.state.accountMap
        const tasks2 = []
        friendsData.forEach(friendId => {
            if (!accountMap.has(friendId)) {
                tasks2.push(accountService.getById(friendId))
            }
        })
        const friendAccounts = await Promise.all(tasks2)
        friendAccounts.forEach(acc => {
            accountMap.set(acc._id, acc)
        })

        this.posts = postsData
        this.friends = friendsData
    },

    mounted() {
        const headerTag = document.querySelector('header')
        const friendList = this.$refs['friend-list']
        friendList.style.top = `${headerTag.clientHeight}px`
    }
}
</script>



<style lang="scss" scoped>
.post-list {
    --friend-list-width: 220px;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 20px;


    .friend-list {
        border: 1px solid red;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        overflow-y: auto;
        width: var(--friend-list-width);


        .friend {
            display: flex;
            align-items: center;
            margin-top: 6px;

            .avatar-box {
                position: relative;

                .avatar {
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                }

                .active {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 13px;
                    height: 13px;
                    background-color: rgba(70, 236, 84, 0.842);
                    border-radius: 50%;
                }
            }

            .name {
                flex: 1;
                font-weight: bold;
                margin-left: 4px;

                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
        }
    }

    .post-component {
        margin: 20px auto 0;
        padding-left: var(--friend-list-width);
        width: 760px;
        max-width: 70%;
    }

    .btn-fixed {
        position: fixed;
        bottom: 12px;
        right: 18px;
        width: 40px;

        .btn-create-post,
        .btn-scroll {
            border: none;
            background-color: cadetblue;
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 18px;
            opacity: .7;
            margin-top: 4px;

            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>