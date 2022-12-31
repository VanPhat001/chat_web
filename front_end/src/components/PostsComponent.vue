<template>
    <div class="posts-component">
        <ul class="post-list">
            <div class="hidden-item" style="height: 1px; background-color: transparent;"></div>

            <li class="post-info" v-for="(post, index) in posts">

                <div class="card">
                    <div class="card-header">
                        <img class="avatar" :src="post.author.avatar">
                        <p class="name">{{ getFullName(post.author) }}</p>
                    </div>

                    <div class="card-body">
                        <p class="content">{{ post.content }}</p>
                    </div>

                    <div class="card-footer">
                        <div class="btn-control">
                            <button class="btn btn-like" @click="likePostHandle(index)">

                                <i class="fa-regular fa-heart"></i>
                                <!-- <i class="fa-solid fa-heart"></i> -->

                                <span>{{ post.likes.length }}</span>
                            </button>

                            <button class="btn btn-comment" @click="fillCommentsBox(index)">
                                <i class="fa-solid fa-comment-dots"></i>
                                <span>{{ post.comments.length }}</span>
                            </button>
                        </div>
                        <div class="comments-box">
                            <ul class="another-comment-list">
                                <li class="another-comment" v-for="comment in commentsOfPost[index]">
                                    <div class="col-left">
                                        <img :src="getAccountById(comment.accountId).avatar" class="avatar">
                                    </div>
                                    <div class="col-right">
                                        <p class="name">{{ getFullName(getAccountById(comment.accountId)) }}</p>
                                        <p class="comment">{{ comment.text }}</p>
                                    </div>
                                </li>
                                <!-- <li class="another-comment">
                                    <div class="col-left">
                                        <img src="https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg" alt="" class="avatar">
                                    </div>
                                    <div class="col-right">
                                        <p class="name">{{ 'ten user nao do' }}</p>
                                        <p class="comment">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi blanditiis delectus voluptates dolorum voluptatibus in tenetur. Laboriosam corrupti, a quas accusamus eum accusantium est nulla doloremque blanditiis quo, assumenda deleniti.</p>
                                    </div>
                                </li> -->
                            </ul>

                            <div class="user-write-comment">
                                <img :src="userLogin.avatar" class="user-avatar">
                                <input type="text" ref="user-comment-input" @keyup.enter="sendComment(index)">
                                <button class="btn btn-send" @click="sendComment(index)">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </li>

        </ul>

        <div class="btn-fixed">
            <span class="btn" @click="openCreatePostModel">
                <i class="fa-solid fa-plus ico-create-post"></i>
            </span>
            <span class="btn" @click="scrollToHiddenItem">
                <i class="fa-solid fa-chevron-up ico-up"></i>
            </span>
        </div>
    </div>
</template>
 

<script>
import postService from '../services/post.service'
import accountService from '../services/account.service'
import commentService from '../services/comment.service'

export default {
    data() {
        return {
            posts: [],
            commentsOfPost: [],
            accountsMap: new Map()
        }
    },

    computed: {
        userLogin() {
            return this.$store.state.account
        }
    },

    methods: {
        getAccountById(id) {
            return this.accountsMap.get(id)
        },
        getFullName(account) {
            return `${account.lastName} ${account.firstName}`
        },
        scrollToHiddenItem() {
            const hiddenItem = document.querySelector('.hidden-item')
            hiddenItem.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        },
        openCreatePostModel() {
            console.log('click')
            this.$router.push('/create-post')
        },
        userLiked(likes) {
            // const likes = this.posts[index].likes
            const userId = this.userLogin._id

            try {
                const USER_NOT_FOUND = undefined
                const result = likes.find(userLiked => userLiked == userId)
                return result !== USER_NOT_FOUND
            } catch (error) {
                console.log(error)
            }

            return false
        },
        likePostHandle(index) {
            const userId = this.userLogin._id
            const likes = this.posts[index].likes

            const USER_NOT_FOUND = -1
            const result = likes.findIndex(userLiked => userLiked == userId)

            if (result === USER_NOT_FOUND) {
                likes.push(userId)
            }
            else {
                likes.splice(result, 1)
            }

            // !TODO: push post to server
        },
        async fillCommentsBox(index) {
            const commentsId = this.posts[index].comments
            console.log(commentsId)

            try {
                //#region 
                const tasks = []
                for (let i = 0; i < commentsId.length; i++) {
                    const commentId = commentsId[i]
                    tasks.push(commentService.getCommentId(commentId))
                }

                const data = await Promise.all(tasks)
                console.log(data);
                //#endregion

                //#region 
                const map = this.accountsMap
                tasks.splice(0, tasks.length)
                for (let i = 0; i < data.length; i++) {
                    const accountId = data[i].accountId
                    if (!map.has(accountId)) {
                        map.set(accountId, null)
                        tasks.push(accountService.getById(accountId))
                    }
                }

                const data2 = await Promise.all(tasks)
                for (let i = 0; i < data2.length; i++) {
                    const account = data2[i]
                    map.set(account._id, account)
                }
                console.log(map);
                //#endregion

                this.commentsOfPost[index] = data
            } catch (error) {
                console.log(error);
            }
        },
        async sendComment(index) {
            const inputElement = this.$refs['user-comment-input'][index]
            console.log('send comment', inputElement.value);

            try {
                const newComment = {
                    accountId: this.userLogin._id,
                    image: null,
                    text: inputElement.value,
                    timeComment: new Date(),
                    comments: []
                }

                const { insertedId } = await commentService.create(newComment)

                // bị lỗi chỗ này thì phải xóa comment có _id là insertedId 
                // và xóa insertId trong post comments
                const posts = this.posts
                posts[index].comments.push(insertedId)  // cân nhắc thay đổi array trước hay sau khi push lên server
                await postService.updateById(posts[index]._id, { comments: posts[index].comments })

                // cập nhập dữ liệu hiển thị trên client
                this.commentsOfPost[index].push(newComment)
                inputElement.value = ''
            } catch (error) {
                console.log(error)
            }

        }
    },

    async created() {
        const data = await postService.getAll()
        console.log(data);

        const tasks = []
        data.forEach(postInfo => {
            const author = postInfo.author
            tasks.push(accountService.getById(author))
        });

        const accounts = await Promise.all(tasks)
        for (let i = 0; i < accounts.length; i++) {
            data[i].author = accounts[i]
            this.commentsOfPost.push([])
        }

        this.posts = data
        this.accountsMap.set(this.userLogin._id, this.userLogin)
    }
}
</script>


<style lang="scss" scoped>
.posts-component {
    height: 100%;
}

.post-list {
    height: 100%;
    overflow-y: auto;

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

    .post-info {
        .card {
            max-width: 80%;
            width: 600px;
            padding: 20px;
            // height: 240px;
            box-shadow: 0 0 10px rgb(207, 206, 206);
            border-radius: 4px;
            margin: 32px auto;
            display: flex;
            flex-direction: column;

            &-header {
                display: flex;
                align-items: center;
                padding: 5px;

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }

                .name {
                    display: inline-block;
                    margin: 8px;
                    font-size: 16px;
                    font-weight: bold;
                }
            }

            &-body {
                flex: 1;
                padding: 10px 5px;

                .content {}
            }

            &-footer {
                // border: 1px solid red;

                .btn-control {
                    --border-color: rgb(180, 179, 179);
                    border-top: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                    margin: 4px 0 12px;
                    padding: 4px 0;

                    button {
                        width: 50%;
                        border: none;
                        border-radius: 6px;
                        height: 36px;
                        font-size: 20px;
                        background-color: transparent;

                        &:hover {
                            background-color: rgb(224, 222, 222);
                        }

                        span {
                            font-size: 90%;
                            margin-left: 4px;
                            opacity: .75;
                        }
                    }
                }

                .comments-box {

                    .another-comment-list {
                        .another-comment {
                            display: flex;

                            &:not(:first-child) {
                                margin-top: 8px;
                            }

                            .col-left {
                                .avatar {
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                }
                            }

                            .col-right {
                                flex: 1;
                                padding: 7px;
                                background-color: lightgrey;
                                border-radius: 10px;

                                .name {
                                    font-weight: bold;
                                }

                                .comment {}
                            }
                        }
                    }



                    .user-write-comment {
                        display: flex;
                        position: relative;
                        background-color: var(--color-background);
                        margin-top: 12px;

                        .user-avatar {
                            width: 34px;
                            height: 34px;
                            border-radius: 50%;
                        }

                        input {
                            flex: 1;
                            margin-left: 4px;
                            border-radius: 34px;
                            border: 1px solid lightgray;
                            font-size: 15px;
                            padding: 0 50px 0 8px;
                        }

                        .btn-send {
                            font-size: 16px;
                            padding: 0 16px;
                            height: 34px;
                            background-color: transparent;
                            border: none;
                            font-weight: bold;

                            position: absolute;
                            top: 0;
                            right: 0;

                            &:hover {
                                color: var(--color-primary)
                            }
                        }
                    }
                }
            }
        }
    }
}

.btn-fixed {
    position: fixed;
    right: 24px;
    bottom: 12px;
    display: flex;
    flex-direction: column;

    .ico-up,
    .ico-create-post {
        margin: 2px;
        padding: 8px;
        border-radius: 50%;
        font-size: 19px;
        background-color: var(--color-primary);
        color: white;
        opacity: .8;

        &:hover {
            opacity: 1;
        }
    }
}
</style>