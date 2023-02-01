<script>
import RegisterComponent from './RegisterComponent.vue'
import LoaddingComponent from './LoaddingComponent.vue'
import accountService from '../services/account.service'
import { mapMutations, mapActions } from 'vuex'
export default {
    components: {
        RegisterComponent, LoaddingComponent
    },
    data() {
        return {
            username: '',
            password: '',
            saveAccount: false,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            xLoadding: 0,
            yLoadding: 0,
        }
    },
    methods: {
        ...mapMutations(['setAccount']),
        ...mapActions(['connectSocket', 'userOnline', 'loggedIn']),
        
        async login() {
            if (this.username === '' || this.password === '') {
                alert('Tài khoản hoặc mật khẩu không được bỏ trống!')
                return
            }

            try {
                const account = await accountService.findByUsernameAndPassword(this.username, this.password)

                const NOT_FOUND = ''
                if (account === NOT_FOUND) {
                    alert('Tài khoản hoặc mật khẩu không hợp lệ!')
                }
                else {
                    // this.setAccount(account)

                    // this.connectSocket()

                    // // await accountService.updateById(account._id, { timeLastActive: null })
                    // // account.timeLastActive = null
                    // await this.userOnline()

                    // // alert('Đăng nhập thành công!')
                    // localStorage.setItem('chatweb-accid', account._id)
                    await this.loggedIn(account)
                    this.$router.push({name: 'home'})
                }

            } catch (error) {
                console.log(error);
            }
        },
        reset() {
            this.username = ''
            this.password = ''
        },
        openModelHandle() {
            this.$refs['register-model'].classList.remove('close')
        },
        closeModelHandle() {
            this.$refs['register-model'].classList.add('close')
        }
    },
    async created() {         
    },
    mounted() {
        document.querySelector('#login-username').focus()

        const loadding = document.querySelector('.loadding-component')
        const { x, y } = loadding.getBoundingClientRect()
        this.xLoadding = x
        this.yLoadding = y
        loadding.remove()
    },
}
</script>

<template>
    <form class="login-component" @submit.prevent="">
        <LoaddingComponent
            :style="{ width: `100vw`, height: `100vh`, left: `-${xLoadding}px`, top: `-${yLoadding}px` }">
        </LoaddingComponent>

        <div class="row">
            <div class="col">
                <p class="title">Đăng nhập</p>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <label for="login-username">Username: </label>
                <input id="login-username" type="text" v-model="username" placeholder="Username" required>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <label for="login-password">Password: </label>
                <input id="login-password" type="password" v-model="password" placeholder="Password" required>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <input type="checkbox" id="save-account" v-model="saveAccount">
                <label for="save-account">Ghi nhớ tài khoản</label>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <button class="btn" @click="login">Đăng nhập</button>
                <!-- <button @click="reset">reset</button> -->
            </div>
        </div>

        <div class="row">
            <div class="col">
                <button class="btn" @click="openModelHandle">Tạo tài khoản</button>
                <!-- <button @click="reset">reset</button> -->
            </div>
        </div>

    </form>

    <div ref="register-model" class="register-model close">
        <div class="background-fixed-fullscreen" @click="closeModelHandle"></div>
        <RegisterComponent class="register-component" @closeModel="closeModelHandle"></RegisterComponent>
    </div>
</template>




<style lang="scss" scoped>
.close {
    display: none !important;
}

.register-model {
    .background-fixed-fullscreen {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.396);
        z-index: 1;
    }

    .register-component {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;

        animation: animation-appear 440ms 1 ease-out both;
    }
}

@keyframes animation-appear {
    from {
        transform: translate(-50%, -60%);
        opacity: 0.4;
    }

    to {
        transform: translate(-50%, -50%);
        opacity: 1;
    }
}



.row {
    display: flex;

    &>.col {
        flex: 1;
    }
}

.login-component {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 640px;
    max-width: 70%;
    padding: 36px 48px 72px;
    background-color: #fff;
    border-radius: 8px;

    .row+.row {
        margin-top: 14px;
    }

    .title {
        font-size: 28px;
        text-align: center;
        margin: 10px;
        font-weight: bold;
        color: #2a42ca;
    }

    label {
        display: none;
    }

    label[for=save-account] {
        display: inline-block;
        font-size: 17px;
        user-select: none;
        margin: 8px 4px;

        &:hover {
            color: #2a42ca;
        }

        &:active {
            color: inherit;
        }
    }

    input[type=text],
    input[type=password],
    button {
        height: 40px;
        width: 100%;
        border-radius: 5px;
        font-size: 18px;
    }

    input[type=text],
    input[type=password] {
        padding: 0 12px;
        border: 1px solid lightgray;
        color: rgb(122, 119, 119);
        background-color: transparent;

        &:focus {
            border-color: #2a42ca;
        }
    }

    button {
        border: none;
        outline: none;
        background-color: #2a42ca;
        color: white;
        font-weight: bold;
        opacity: .88;

        &:hover {
            opacity: 1;
        }
    }



}
</style>