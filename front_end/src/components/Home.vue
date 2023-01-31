<template>
    <div class="home">
        <LoaddingComponent></LoaddingComponent>
        <FriendList class="friend-list" @loaded="incCounter"></FriendList>
        <PostList class="post-list" @loaded="incCounter"></PostList>
    </div>
</template>


<script>
import FriendList from './FriendList.vue'
import LoaddingComponent from './LoaddingComponent.vue';
import PostList from './PostList.vue';

export default {
    components: {
        FriendList,
        PostList,
        LoaddingComponent
    },
    data() {
        return {
            loadedCounter: 0
        }
    },
    methods: {
        incCounter() {
            this.loadedCounter++

            if (this.loadedCounter == 2) {
                try {
                    const loadding = document.querySelector('.loadding-component')
                    loadding.remove()
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.home {
    height: 100%;
    display: flex;

    .friend-list {
        width: 220px;
        // background-color: rgba(121, 121, 121, 0.5);
        border-right: 1px solid #acacac;
    }

    .post-list {
        flex: 1;

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
            background: #555 !important;
            background: transparent;
            border-radius: 10px;

        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    }
}
</style>