<template>
    <div class="header-component">
        <div class="left">
            <router-link to="/home" title="goto home">
                <i class="fa-solid fa-house router-link-ico"></i>
            </router-link>

            <router-link to="/contact-book" title="goto contact book">
                <i class="fa-solid fa-address-book router-link-ico"></i>
            </router-link>

            <router-link to="/chat-room" title="goto chat room">
                <i class="fa-regular fa-message router-link-ico"></i>
            </router-link>

            <span @click="logOutAccount" title="log out">
                <i class="fa-solid fa-right-from-bracket"></i>
            </span>
        </div>

        <router-link class="right" :to="`/profile/${loginAccount._id}`">
            <p class="name">{{ fullName }}</p>
            <img :src="loginAccount.avatar">
        </router-link>
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
            // window.open('/login', '_self')
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

        .router-link-ico,
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