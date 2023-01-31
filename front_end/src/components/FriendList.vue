<template>

    <div class="friend-list" ref="friend-list">
        <h1 style="margin: 30px 0 10px;">Bạn bè</h1>
        <ul>
            <li v-for="friendId in friends">
                <!-- <router-link :to="`/profile/${friendId}`" class="friend"> -->
                <router-link :to="{ name: 'profile', params: { 'id': friendId } }" class="friend">
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
import friendService from '../services/friend.service'
import helper from '../helper';
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

        fullName: helper.fullName
    },

    async created() {
        const friendsData = await friendService.getAllFriendOfAccount(this.userLogin._id)

        const accountMap = this.$store.state.accountMap

        const friendIdList = []
        friendsData.forEach(friendId => {
            if (!accountMap.has(friendId)) {
                friendIdList.push(friendId)
            }
        })

        await this.$store.dispatch('pushToAccountMap', friendIdList)

        this.friends = friendsData
        this.$emit('loaded')
    },

    mounted() {
        const headerTag = document.querySelector('header')
        const friendList = this.$refs['friend-list']
        friendList.style.top = `${headerTag.clientHeight}px`

        const el = this.$refs['friend-list']
        // const friendListWidth = el.clientWidth
        // if (friendList.clientWidth >= 350) {
        //     el.classList.add('two-columns')
        // }

        if (this.$route.path.startsWith('/contact-book')) {
            el.classList.add('two-columns')
        }
    },
}
</script>



<style lang="scss" scoped>
.friend-list {
    overflow-y: auto;
    width: var(--friend-list-width);


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
                width: 44px;
                height: 44px;
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
            font-size: 16px;
            margin-left: 4px;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
}

.friend-list.two-columns {

    // ul {
    //     display: flex;
    // }
    ul {
        padding: 10px 40px;

        li {
            width: 50%;
            display: inline-block;
        }
    }

}
</style>