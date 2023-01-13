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

            <span class="dropdown-box" @click="showNotifyDropdown">
                <i class="fa-solid fa-bell"></i>

                <DropdownComponent class="dropdown-component dropdown" :pOpen="openDropdown">
                    <template v-slot:default>
                        <ul class="notify-list">
                            <li class="notify" v-for="item in 20">
                                notify {{ item }}
                            </li>
                        </ul>
                    </template>
                </DropdownComponent>
            </span>

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
import DropdownComponent from './DropdownComponent.vue';
export default {
    components: {
        DropdownComponent
    },
    data() {
        return {
            openDropdown: false
        }
    },
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

        showNotifyDropdown() {
            this.openDropdown = !this.openDropdown
        },
        async logOutAccount() {
            this.$store.state.socket.disconnect()
            this.$store.state.socket = null

            await this.userOffline()

            this.$router.push('/login')
            // window.open('/login', '_self')
        },
    }
}
</script>



<style lang="scss" scoped>
.dropdown-box {
    position: relative;

    &>.dropdown {
        position: absolute;
        top: calc(100% + 3px);
        left: -20px;

        // background-color: blue;
        box-shadow: 1px 3px 10px grey;
        background-color: gainsboro;
        width: 300px;
        height: 200px;
        z-index: 1;

        --arrow-x: 20px;
        --arrow-color: gainsboro;

        .notify-list {
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


            .notify {
                // margin: 3px 0;
                padding: 3px 5px;
                background-color: gainsboro;

                &:hover {
                    background-color: rgb(196, 194, 194);
                }
            }
        }
    }
}

.header-component {
    display: flex;
    justify-content: space-between;
    border: 1px solid green;
    padding: 0 10px;
    align-items: center;

    .left {

        .router-link-ico,
        .fa-bell,
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