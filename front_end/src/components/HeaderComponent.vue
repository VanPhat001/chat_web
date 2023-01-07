<template>
    <div class="header-component">
        <div class="left">
            <router-link to="/posts">
                <i class="fa-solid fa-house"></i>
            </router-link>

            <router-link to="/chat-room">
                <i class="fa-regular fa-message"></i>
            </router-link>

            <span @click="logOutAccount">
                <i class="fa-solid fa-right-from-bracket"></i>
            </span>
        </div>

        <div class="right">
            <p class="name">{{ fullName }}</p>
            <img :src="loginAccount.avatar">
        </div>
    </div>
</template>


<script>
import { mapActions } from 'vuex'
export default {
    computed: {
        loginAccount() {
            return this.$store.state.account
        },
        fullName() {
            return this.loginAccount.lastName + ' ' + this.loginAccount.firstName
        }
    },
    methods: {
        ...mapActions(['userOffline']),
        async logOutAccount() {
            this.$store.state.socket.disconnect()
            this.$store.state.socket = null

            await this.userOffline()

            this.$router.push('/login')
        }
    }
}
</script>



<style lang="scss" scoped>
.header-component {
    display: flex;
    justify-content: space-between;
    border: 1px solid green;
    padding: 0 10px;
    align-items: center;

    .left {

        .fa-house,
        .fa-message,
        .fa-right-from-bracket {
            padding: 6px;
            font-size: 18px;
            cursor: pointer;
        }
    }

    .right {
        display: flex;
        --img-size: 50px;

        .name {
            display: inline-block;
            line-height: var(--img-size);
            font-weight: bold;
            margin-right: 5px;
        }

        img {
            width: var(--img-size);
            height: var(--img-size);
            border-radius: 50%;
        }
    }
}
</style>