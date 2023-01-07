<template>
    <div class="post-component">

        <div class="card">
            <div class="card-header">
                <img class="avatar" :src="author.avatar">
                <div class="info">
                    <p class="name">{{ fullName(author) }}</p>
                    <p ref="count-time" class="count-time">{{ 'vừa xong' }}</p>
                </div>
            </div>
            <div class="card-body">
                <div class="content">
                    <p class="content-text">{{ post.content.text }}</p>
                    <img class="content-image"
                        v-if="post.content.image !== null"
                        :src="post.content.image">
                </div>

                <div class="controls">
                    <span class="btn btn-like" :class="{ 'color-red': userLiked }" @click="likePost">
                        <i class="fa-solid fa-heart"></i>
                        <span>{{ post.likes.length }}</span>
                    </span>
                    <span class="btn btn-comment" @click="openCommentBox">
                        <i class="fa-solid fa-comment"></i>
                        <span>{{ post.comments.length }}</span>
                    </span>
                </div>

                <ul class="another-comment-box">
                    <li v-for="comment in comments">

                        <img class="avatar" :src="getAccountMap(comment.accountId).avatar">

                        <div class="info">
                            <p class="name">{{ fullName(getAccountMap(comment.accountId)) }}</p>
                            <p class="content-text">{{ comment.text }}</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="card-footer">

                <div class="user-comment-box">
                    <img class="avatar" :src="userLogin.avatar">

                    <div class="input-box">
                        <input type="text" placeholder="soạn comment" @keydown.enter="sendComment"
                            v-model="commentText">
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
.color-red {
    color: rgb(211, 31, 31);
}

.card {
    width: 100%;
    padding: 16px;
    border-radius: 7px;
    background-color: rgba(140, 155, 165, 0.247);

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
                overflow: hidden;
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
                    padding: 0 12px;

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
import accountService from '../services/account.service'
import commentService from '../services/comment.service'
import postService from '../services/post.service'
export default {
    props: {
        pPost: { type: Object, default: {} }
    },
    data() {
        return {
            author: {},
            intervalId: null,
            constants: {
                MINUTE: 60000,
                HOUR: 60 * 60000,
                DAY: 24 * 60 * 60000,
                data: [
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
            },
            comments: [],
            commentText: ''
        }
    },
    computed: {
        userLogin() {
            return this.$store.state.account
        },
        post() {
            return this.pPost
        },
        userLiked() {
            const user = this.userLogin
            const likes = this.post.likes
            const NOT_FOUND = -1
            const result = likes.findIndex(accId => accId == user._id)

            return result !== NOT_FOUND
        }
    },
    methods: {
        getAccountMap(accId) {
            return this.$store.state.accountMap.get(accId)
        },
        setAccountMap(accId, acc) {
            this.$store.state.accountMap.set(accId, acc)
        },
        hasAccountMap(accId) {
            return this.$store.state.accountMap.has(accId)
        },

        fullName(account) {
            return `${account.lastName} ${account.firstName}`
        },
        updateTime() {
            const diffMSec = Date.now() - new Date(this.post.timePost)
            const data = this.constants.data
            for (let i = 0; i < data.length; i++) {
                const { value, suffix } = data[i];
                if (diffMSec > value) {
                    const text = `${Math.round(diffMSec / value)} ${suffix}`
                    this.$refs['count-time'].textContent = text
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
                    const commentTasks = []
                    comments.forEach(cmtId => {
                        commentTasks.push(commentService.getCommentId(cmtId))
                    })

                    commentsData = await Promise.all(commentTasks)
                } catch (error) { throw (error) }
                //#endregion


                //#region get account info
                try {
                    const accountTasks = []
                    commentsData.forEach(comment => {
                        const accId = comment.accountId
                        if (!this.hasAccountMap(accId)) {
                            accountTasks.push(accountService.getById(accId))
                        }
                    });
                    const accountsData = await Promise.all(accountTasks)

                    accountsData.forEach(acc => {
                        this.setAccountMap(acc._id, acc)
                    })
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
            }
        }
    },

    async created() {
        try {
            this.author = await accountService.getById(this.post.author)

            this.updateTime()
            this.intervalId = setInterval(() => {
                this.updateTime()
            }, 20000);

        } catch (error) {
            console.log(error)
        }
    },

    unmounted() {
        clearInterval(this.intervalId)
    }

}
</script>