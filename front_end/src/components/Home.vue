<template>
    <div class="home">
        <FriendList class="friend-list"></FriendList>
        <PostList class="post-list"></PostList>
    </div>
</template>


<script>
import FriendList from './FriendList.vue'
import PostList from './PostList.vue';

export default {
    components: {
        FriendList,
        PostList
    }
}
</script>


<style lang="scss" scoped>
.home {
    height: 100%;
    --friend-list-width: 200px;

    .friend-list {
        width: var(--friend-list-width);
    }

    .post-list {
        padding-left: var(--friend-list-width);

        
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
    }
}
</style>