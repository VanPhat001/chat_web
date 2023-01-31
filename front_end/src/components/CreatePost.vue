<script>
import postService from '../services/post.service'
export default {
    data() {
        return {
            textContent: '',
            imgLink: ''
        }
    },
    computed: {
        userLogin() {
            return this.$store.state.account
        }
    },
    methods: {
        selectImage() {
            console.log(this.imgLink)
        },
        async createPost() {
            try {
                const content = {
                    text: this.textContent.length > 0 ? this.textContent : null,
                    image: this.imgLink.length > 0 ? this.imgLink : null
                }

                await postService.create({
                    author: this.userLogin._id,
                    content: content
                })

                alert('ok')
                this.$router.push({name: 'home'})
            } catch (error) {
                console.log(error);
                alert('error')
            }
        }
    }
}
</script>


<template>
    <div class="create-post">

        <div class="box">
            <div class="box-header">
                <img class="avatar" :src="userLogin.avatar">
                <div class="name">{{ userLogin.lastName + " " + userLogin.firstName }}</div>
            </div>

            <div class="box-body">
                <textarea class="content" cols="30" rows="10" v-model="textContent"
                    placeholder="nhập nội dung"></textarea>

                <label for="post-image">Image link:</label>
                <input id="post-image" type="text" v-model="imgLink" @keyup="selectImage">
                <br>

                <div style="text-align: center;">
                    <img :src="imgLink">
                </div>
            </div>

            <div class="box-footer">
                <button :class="{ 'btn-post': true, 'btn': textContent.length > 0 || imgLink.length > 0 }"
                    :disabled="textContent.length == 0 && imgLink.length == 0" @click="createPost">Đăng</button>
            </div>

        </div>

    </div>
</template>


<style lang="scss" scoped>
.create-post {
    width: 550px;
    margin: 20px auto;
}

.box {
    &-header {
        display: flex;
        align-items: center;

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .name {
            font-size: 15px;
            font-weight: bold;
            margin-left: 5px;
        }
    }

    &-body {
        padding: 10px 0;

        textarea {
            width: 100%;
            resize: vertical;
        }

        input {
            width: 100%;
            padding: 3px 8px;
        }

        img {
            margin-top: 8px;
            max-width: 100%;
        }
    }

    &-footer {
        button {
            width: 100%;
            border: none;
            background-color: var(--color-3);
            color: white;
            padding: 8px 0;
            font-weight: bold;
            font-size: 16px;
            opacity: .65;
        }

        .btn {
            opacity: 1;
        }
    }
}
</style>