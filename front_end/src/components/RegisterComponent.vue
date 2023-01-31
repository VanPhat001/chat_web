<template>
    <div class="register-component">

        <p class="title">Đăng ký</p>

        <form @submit.prevent="createAccount">

            <div class="row">
                <div class="col">
                    <input class="username" id="register-username" type="text" placeholder="Username" v-model="username"
                        autofocus required>
                </div>
            </div>

            <div class="row">
                <div class="col password-box">
                    <input class="password" id="register-password" type="password" v-model="password"
                        placeholder="Mật khẩu" required>

                    <div class="show-hide-password" @click.prevent="changeStateShowPassword()">
                        <span v-if="showPassword">
                            <i class="fa-solid fa-eye-slash"></i>
                        </span>
                        <span v-else>
                            <i class="fa-solid fa-eye"></i>
                        </span>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col password-box">
                    <input class="password2" id="register-password2" type="password" v-model="password2"
                        placeholder="Nhập lại mật khẩu" required>

                    <div class="show-hide-password" @click.prevent="changeStateShowPassword2()">
                        <span v-if="showPassword2">
                            <i class="fa-solid fa-eye-slash"></i>
                        </span>
                        <span v-else>
                            <i class="fa-solid fa-eye"></i>
                        </span>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="lastname" id="register-lastname" type="text" placeholder="Họ" v-model="lastName"
                        required>
                </div>
                <div class="col">
                    <input class="firstname" id="register-firstname" type="text" placeholder="Tên" v-model="firstName"
                        required>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="email" type="text" placeholder="Email" v-model="email">
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="address" type="text" placeholder="Địa chỉ" v-model="address">
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input type="radio" name="gender" id="gender-male" :value="GENDER.MALE" v-model="gender">
                    <label for="gender-male">Nam</label>
                </div>
                <div class="col">
                    <input type="radio" name="gender" id="gender-female" :value="GENDER.FEMALE" v-model="gender">
                    <label for="gender-female">Nữ</label>
                </div>
                <div class="col">
                    <input type="radio" name="gender" id="gender-other" :value="GENDER.OTHER" v-model="gender">
                    <label for="gender-other">Khác</label>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <button class="btn" type="submit">Tạo tài khoản</button>
                </div>
            </div>

        </form>

        <div class="btn btn-close" @click="closeModel">
            <i class="fa-solid fa-xmark"></i>
        </div>

    </div>
</template>


<script>
import accountService from '../services/account.service';
export default {
    emits: ['closeModel'],
    data() {
        const GENDER = this.$store.state.GENDER
        return {
            username: '',
            password: '',
            password2: '',
            lastName: '',
            firstName: '',
            email: '',
            address: '',
            gender: GENDER.MALE,
            GENDER: GENDER,
            showPassword: false,
            showPassword2: false
        }
    },
    methods: {
        closeModel() {
            this.$emit('closeModel')
        },
        changeStateShowPassword() {
            this.showPassword = !this.showPassword
            document.querySelector('#register-password')
                .type = this.showPassword ? 'text' : 'password'
        },
        changeStateShowPassword2() {
            this.showPassword2 = !this.showPassword2
            document.querySelector('#register-password2')
                .type = this.showPassword2 ? 'text' : 'password'
        },
        createAccount() {
            if (this.password !== this.password2) {
                alert('dữ liệu không hợp lệ')
            }

            accountService.create({
                username: this.username,
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                avatar: 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg'
            })
                .then(({ insertedId }) => {
                    console.log({ insertedId })
                    alert('ok')
                    alert('tự chuyển qua login form rồi tự đăng nhập, nhà bao việc')
                })
                .catch((err) => {
                    console.log(err)
                    alert('có lỗi xảy ra phía server')
                })
        }
    }
}
</script>


<style lang="scss" scoped>
.row {
    display: flex;

    &>.col {
        flex: 1;
    }
}

.password-box {
    position: relative;

    .show-hide-password {
        position: absolute;
        top: 50%;
        right: 7px;
        transform: translateY(-50%);
        font-size: 18px;

        &:hover {
            opacity: 1;
        }

        &,
        &:active {
            opacity: .7;
        }
    }
}

.register-component {
    background-color: #fff;
    padding: 26px 58px 40px;
    border-radius: 10px;

    .title {
        font-weight: bold;
        color: #2a42ca;
        font-size: 28px;
        margin-bottom: 12px;
        text-align: center;
    }

    form {
        .row+.row {
            margin-top: 6px;
        }

        .col+.col {
            margin-left: 8px;
        }

        input:not([type=radio]) {
            width: 100%;
            height: 32px;
            border-radius: 4px;
            border: 1px solid lightgray;
            padding: 0 8px;
        }

        input:focus {
            border-color: #2a42ca;
        }

        label {
            // font-weight: bold;
            padding-left: 4px;
            font-size: 16px;
        }

        button {
            margin-top: 8px;
            font-weight: bold;
            font-size: 16px;
            color: white;
            background-color: #2a42ca;
            border: none;
            outline: none;
            width: 100%;
            height: 32px;
            border-radius: 4px;
            opacity: .8;

            &:hover {
                opacity: 1;
            }
        }
    }

    .btn-close {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        opacity: .4;

        &:hover {
            opacity: 1;
        }

    }
}
</style>