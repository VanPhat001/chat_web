<template>
    <div class="post-component">

        <div class="card" v-if="author._id">
            <div class="card-header">
                <img class="avatar" :src="author.avatar">
                <div class="info">
                    <!-- <router-link class="name" :to="`/profile/${author._id}`"> -->
                    <router-link class="name" :to="{ name: 'profile', params: { 'id': author._id } }">
                        {{ fullName(author) }}
                    </router-link>
                    <p ref="count-time" class="count-time">{{ 'vừa xong' }}</p>
                </div>
            </div>
            <div class="card-body">
                <div class="content">
                    <p class="content-text">{{ post.content.text }}</p>
                    <img class="content-image" @click="imageClickHandle(post.content.image)"
                        v-if="post.content.image !== null" :src="post.content.image">
                </div>

                <div class="controls">
                    <span class="btn btn-like" :class="{ 'like': userLiked }" @click="likePost">
                        <!-- <i class="fa-solid fa-heart"></i> -->
                        <i class="fa-solid fa-thumbs-up"></i>
                        <span>{{ post.likes.length }} lượt thích</span>
                    </span>
                    <span class="btn btn-comment" @click="openCommentBox">
                        <i class="fa-solid fa-comment"></i>
                        <span>{{ post.comments.length }} bình luận</span>
                    </span>
                </div>

                <ul class="another-comment-box">
                    <li v-for="comment in comments">

                        <img class="avatar" :src="getAccountMap(comment.accountId).avatar">

                        <div class="info">
                            <!-- <router-link class="name" :to="`/profile/${comment.accountId}`"> -->
                            <router-link class="name" :to="{ name: 'profile', params: { 'id': comment.accountId } }">
                                {{ fullName(getAccountMap(comment.accountId)) }}
                            </router-link>
                            <p class="content-text">{{ comment.text }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="card-footer">

                <div class="user-comment-box">
                    <router-link :to="{ name: 'profile', params: { 'id': userLogin._id } }">
                        <img class="avatar" :src="userLogin.avatar">
                    </router-link>

                    <div class="input-box">
                        <input type="text" placeholder="soạn comment" @keydown.enter="sendComment"
                            v-model="commentText">

                        <!-- <div class="emoji-picker-box">
                            <EmojiPicker v-show="openEmojiPicker" class="emoji-picker" @onSelectEmoji="selectEmoji">
                            </EmojiPicker>

                            <button class="btn" @click="openOrCloseEmojiPicker">
                                <i class="fa-solid fa-face-laugh-squint"></i>
                            </button>
                        </div> -->

                        <button class="btn" @click="sendComment">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<style lang="scss" scoped>
.emoji-picker-box {
    position: relative;

    .emoji-picker {
        position: absolute;
        bottom: 100%;
        right: 3px;
        z-index: 1;
    }

    button {
        height: 100%;
    }
}

.like {
    color: blue;
}

.card {
    width: 100%;
    padding: 16px;
    border-radius: 7px;
    background-color: #fff;

    &-header {
        display: flex;

        .avatar {
            border-radius: 50%;
            width: 40px;
            height: 40px;
        }

        .info {
            margin-left: 5px;

            .name {
                font-size: 16px;
                font-weight: bold;
            }

            .count-time {
                opacity: .65;
            }
        }
    }

    &-body {

        .content {
            padding: 12px;
            text-align: center;

            &-text {
                text-align: left;
            }

            &-image {
                margin-top: 6px;
                max-width: 100%;
            }
        }

        .controls {
            border: 1px solid transparent;
            border-top-color: lightgray;
            border-bottom-color: lightgray;
            padding: 2px 0;

            .btn-like,
            .btn-comment {
                font-size: 20px;
                text-align: center;
                width: 50%;
                padding: 4px 0;

                &:hover {
                    border-radius: 4px;
                    background-color: rgba(119, 136, 153, 0.185);
                }

                span {
                    margin-left: 5px;
                }
            }
        }

        .another-comment-box {
            padding: 12px 24px;

            li {
                display: flex;

                &+li {
                    margin-top: 8px;
                }

                .avatar {
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;

                }

                .info {
                    flex: 1;
                    margin-left: 4px;

                    .name {
                        font-weight: bold;
                    }

                    .content-text {}

                    .content-image {
                        cursor: pointer;
                    }
                }
            }
        }
    }

    &-footer {
        .user-comment-box {
            // border: 1px solid red;
            display: flex;
            align-items: center;

            .avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
            }

            .input-box {
                flex: 1;
                margin-left: 4px;
                border: 1px solid darkblue;
                display: flex;
                height: 30px;
                border-radius: 30px;
                background-color: white;

                input {
                    border: none;
                    padding-left: 12px;
                    flex: 1;
                    background-color: transparent;
                }

                button {
                    border: none;
                    background-color: transparent;
                    font-size: 16px;
                    padding: 0 8px 0 0;

                    &:hover {
                        color: cornflowerblue
                    }
                }
            }
        }
    }
}
</style>


<script>
import EmojiPicker from './EmojiPicker.vue'
import accountService from '../services/account.service'
import commentService from '../services/comment.service'
import postService from '../services/post.service'
import helper from '../helper'
export default {
    emits: ['imageClick'],
    components: {
        EmojiPicker
    },
    props: {
        pPost: { type: Object, default: {} }
    },
    data() {
        const constants = Object.freeze({
            MINUTE: 60000,
            HOUR: 60 * 60000,
            DAY: 24 * 60 * 60000,
            MONTH: 30 * 24 * 60 * 60000,
            data: [
                {
                    value: 30 * 24 * 60 * 60000,
                    suffix: 'tháng trước'
                },
                {
                    value: 24 * 60 * 60000,
                    suffix: 'ngày trước'
                },
                {
                    value: 60 * 60000,
                    suffix: 'giờ trước'
                },
                {
                    value: 60000,
                    suffix: 'phút trước'
                },
            ]
        })
        return {
            author: {},
            intervalId: null,
            constants: constants,
            comments: [],
            commentText: '',
            openEmojiPicker: false
        }
    },
    computed: {
        userLogin() {
            return this.$store.state.account
        },
        post() {
            // const post = this.pPost
            // const nd = new Date(post.timePost)
            // nd.setDate(nd.getDate() - 2)
            // post.timePost =  nd.toString()
            return this.pPost
        },
        userLiked() {
            const user = this.userLogin
            const likes = this.post.likes
            const NOT_FOUND = -1
            const result = likes.findIndex(accId => accId == user._id)

            return result !== NOT_FOUND
        },
        socket() {
            return this.$store.state.socket
        }
    },
    methods: {
        openOrCloseEmojiPicker() {
            this.openEmojiPicker = !this.openEmojiPicker
        },
        selectEmoji({ emoji }) {
            this.commentText += emoji
        },
        getAccountMap(accId) {
            return this.$store.state.accountMap.get(accId)
        },
        setAccountMap(accId, acc) {
            this.$store.state.accountMap.set(accId, acc)
        },
        hasAccountMap(accId) {
            return this.$store.state.accountMap.has(accId)
        },

        fullName: helper.fullName,
        updateTime() {
            const diffMSec = Date.now() - new Date(this.post.timePost)
            const data = this.constants.data
            for (let i = 0; i < data.length; i++) {
                const { value, suffix } = data[i];
                if (diffMSec >= value) {
                    const text = `${Math.trunc(diffMSec / value)} ${suffix}`

                    try { this.$refs['count-time'].textContent = text }
                    catch (error) { console.log(error) }

                    return
                }
            }
            // default: `vừa xong`
        },
        async likePost() {
            const user = this.userLogin
            const likes = this.post.likes
            const NOT_FOUND = -1
            const index = likes.findIndex(accId => accId == user._id)

            if (index == NOT_FOUND) {
                likes.push(user._id)
                this.socket.emit('like-post-to', {
                    from: user._id,
                    to: this.author._id,
                    postId: this.post._id
                })
            }
            else {
                likes.splice(index, 1)
            }

            await postService.updateById(this.post._id, {
                likes: likes
            })
        },
        async openCommentBox() {
            try {
                //#region get comment info
                let commentsData = null
                try {
                    const comments = this.post.comments

                    const cmtIdList = []
                    comments.forEach(cmtId => {
                        cmtIdList.push(cmtId)
                    })

                    commentsData = await commentService.getMany(cmtIdList)
                } catch (error) { throw (error) }
                //#endregion


                //#region get account info
                try {
                    const accIdList = []
                    commentsData.forEach(comment => {
                        const accId = comment.accountId
                        if (!this.hasAccountMap(accId)) {
                            accIdList.push(accId)
                        }
                    });

                    await this.$store.dispatch('pushToAccountMap', accIdList)
                } catch (error) { throw (error) }
                //#endregion


                this.comments = commentsData

            } catch (error) {
                console.log(error);
            }
        },
        async sendComment() {
            if (this.commentText.length > 0) {
                console.log('send comment', this.commentText)

                const { insertedId } = await commentService.create({
                    accountId: this.userLogin._id,
                    text: this.commentText,
                })

                await postService.pushComment(this.post._id, insertedId)
                this.post.comments.push(insertedId)

                this.commentText = ''
                await this.openCommentBox()

                this.socket.emit('commentTo', {
                    receipient: this.author._id,
                    commentId: insertedId,
                    postId: this.post._id
                })
            }
        },
        imageClickHandle(imgLink) {
            this.$emit('imageClick', imgLink)
        }
    },

    async created() {
        try {
            this.author = await accountService.getById(this.post.author)

            // settimeout 0s để tránh tương tác vs DOM khi còn trong created()
            setTimeout(() => {
                this.updateTime()
            }, 0)
            this.intervalId = setInterval(() => {
                this.updateTime()
            }, 20000)

        } catch (error) {
            console.log(error)
        }
    },

    unmounted() {
        clearInterval(this.intervalId)
    }

}
</script>