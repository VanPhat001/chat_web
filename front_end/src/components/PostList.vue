<template>
    <div class="post-list">
        <div ref="hidden-item" style="height: 0;"></div>

        <template v-for="post in posts">
            <PostComponent class="post-component" :pPost="post" @imageClick="openImageFullScreen"></PostComponent>
        </template>

        <div class="btn-fixed">
            <router-link class="btn btn-create-post" :to="{ name: 'create-post' }">
                <i class="fa-solid fa-plus"></i>
            </router-link>
            <button class="btn btn-scroll" @click="scrollToTop">
                <i class="fa-solid fa-angle-up"></i>
            </button>
        </div>

        <div ref="image-box" class="image-box close">
            <div class="background-fullscreen" @click="closeImageFullScreen"></div>
            <img ref="image-show" src="">
        </div>

    </div>
</template>



<script>
import PostComponent from './PostComponent.vue'
import postService from '../services/post.service'
export default {
    emits: ['loaded'],

    components: {
        PostComponent
    },

    props: {
        pUserId: { type: String, default: '' }
    },

    data() {
        return {
            posts: []
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
            console.log({ el });
            el.scrollIntoView({ behavior: "smooth", inline: "nearest" });
        },
        openImageFullScreen(imgLink) {
            this.$refs['image-show'].src = imgLink
            this.$refs['image-box'].classList.remove('close')
        },
        closeImageFullScreen() {
            this.$refs['image-box'].classList.add('close')
        }
    },

    async created() {
        try {
            if (this.pUserId !== '') {
                this.posts = await postService.getByAuthor(this.pUserId)
            }
            else {
                this.posts = await postService.getAll()
            }
        } catch (error) {
            console.log(error)
        }

        this.$emit('loaded')
    },
}
</script>



<style lang="scss" scoped>
.image-box {
    position: fixed;
    inset: 0;
    z-index: 1;

    &.close {
        display: none;
    }

    .background-fullscreen {
        background-color: rgba(0, 0, 0, 0.301);
        width: 100%;
        height: 100%;
    }

    img {
        max-width: 70vw;
        max-height: 70vh;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 100%;
    }
}


.post-list {
    // --friend-list-width: 220px;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 20px;

    .post-component {
        margin: 20px auto 0;
        // padding-left: var(--friend-list-width);
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