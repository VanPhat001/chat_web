<template>
    <div class="post-list">

        <div ref="hidden-item" style="height: 0;"></div>

        <template v-for="post in posts">
            <PostComponent :pPost="post"></PostComponent>
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
import postService from '../services/post.service';
export default {
    components: {
        PostComponent
    },

    data() {
        return {
            posts: []
        }
    },

    methods: {
        scrollToTop() {
            const el = this.$refs['hidden-item']
            el.scrollIntoView({ behavior: "smooth", inline: "nearest" });
        }
    },

    async created() {
        const postsData = await postService.getAll()
        this.posts = postsData
    }
}
</script>



<style lang="scss" scoped>
.post-list {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 20px;
}

.post-component {
    margin: 20px auto 0;
    width: 600px;    
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
</style>