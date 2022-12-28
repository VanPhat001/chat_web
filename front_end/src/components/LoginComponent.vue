<script>
import accountService from '../services/account.service'
import {mapMutations} from 'vuex';
export default {
    data() {
        return {
            username: 'phat',
            password: '1234'
        }
    },
    methods: {
        ...mapMutations(['setAccount']),
        async login() {
            try {
                const account = await accountService.findByUsernameAndPassword(this.username, this.password)  
                
                const NOT_FOUND = ''
                if (account === NOT_FOUND) {
                    alert('Tài khoản hoặc mật khẩu không hợp lệ!')
                }
                else {
                    this.setAccount(account)
                    // alert('Đăng nhập thành công!')
                    this.$router.push('/chat-room')
                } 
                
            } catch (error) {
                console.log(error);
            }
        },
        reset() {
            this.username = ''
            this.password = ''
        }
    }
}
</script>

<template>
    <form class="login-component" @submit.prevent="">

        <table>
            <caption>Login</caption>

            <tr>
                <td>
                    <label for="login-username">Username: </label>
                </td>
                <td>
                    <input id="login-username" type="text" v-model="username"> 
                </td>
            </tr>
            <tr>
                <td>
                    <label for="login-password">Password: </label>
                </td>
                <td>
                    <input id="login-password" type="password" v-model="password">
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button @click="login">login</button>
                    <button @click="reset">reset</button>
                </td>
            </tr>


        </table>


    </form>
</template>




<style lang="scss" scoped>
* {
    font-size: inherit;
}

table {
    border-collapse: collapse;
    border: 1px solid red;
    font-size: 20px;



    tr {
        border: 1px solid red;

        td {
            border: 1px solid red;

            button {
                padding: 4px 20px;
            }
        }
    }
}
</style>