<template>
    <div class="post-single">
        <!-- {{ postId }} -->
        <template v-if="post !== null">
            <PostComponent :pPost="post"></PostComponent>
        </template>
    </div>
</template>


<script>
import postService from '../services/post.service';
import PostComponent from './PostComponent.vue'

export default {
    components: {
        PostComponent
    },
    data() {
        return {
            post: null,
        }
    },
    computed: {
        postId() {
            return this.$route.params.id
        }
    },
    async created() {
        this.post = await postService.getById(this.postId)
    },
}
</script>


<style lang="scss" scoped>
.post-single {
    padding: 20px 10%;
}
</style>