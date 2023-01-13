<template>

    <div class="friend-list" ref="friend-list">
        <ul>
            <li v-for="friendId in friends">
                <router-link :to="`/profile/${friendId}`" class="friend">
                    <span class="avatar-box">
                        <img class="avatar" :src="getAccount(friendId).avatar">
                        <div v-show="getAccount(friendId).timeLastActive === null" class="active"></div>
                    </span>

                    <p class="name">{{ fullName(getAccount(friendId)) }}</p>
                </router-link>
            </li>
        </ul>
    </div>

</template>


<script>
import accountService from '../services/account.service'
import friendService from '../services/friend.service'

export default {
    emits: ['loaded'],

    data() {
        return {
            friends: []
        }
    },

    computed: {
        userLogin() {
            return this.$store.state.account
        }
    },

    methods: {
        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },

        fullName(account) {
            return `${account.lastName} ${account.firstName}`
        }
    },

    async created() {
        const friendsData = await friendService.getAllFriendOfAccount(this.userLogin._id)

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

        this.friends = friendsData
        this.$emit('loaded')
    },

    mounted() {
        const headerTag = document.querySelector('header')
        const friendList = this.$refs['friend-list']
        friendList.style.top = `${headerTag.clientHeight}px`
    },
}
</script>



<style lang="scss" scoped>
.friend-list {
    border: 1px solid red;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    width: var(--friend-list-width);
    background-color: #fff;


    .friend {
        display: flex;
        align-items: center;
        padding: 5px 8px;

        &:first-child {
            margin-top: 4px;
        }

        &:hover {
            background-color: gainsboro;
        }

        .avatar-box {
            position: relative;

            .avatar {
                border-radius: 50%;
                width: 38px;
                height: 38px;
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
</style>