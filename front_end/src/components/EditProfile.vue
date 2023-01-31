<template>
    <div class="edit-profile">
        <h1>Chỉnh sửa thông tin</h1>
        <form action="" @submit.prevent="">

            <div class="row">
                <label class="label-row" for="username">Username</label>
                <input id="username" type="text" placeholder="username" v-model="username" disabled>
            </div>

            <div class="row">
                <label class="label-row" for="password">Password</label>
                <input id="password" type="text" placeholder="password" v-model="password" disabled>
            </div>

            <div class="row">
                <label class="label-row" for="lastName">Họ</label>
                <input id="lastName" type="text" v-model="lastName">
            </div>

            <div class="row">
                <label class="label-row" for="firstName">Tên</label>
                <input id="firstName" type="text" v-model="firstName">
            </div>

            <div class="row">
                <p>Tên hiển thị "{{ nameDisplay }}"</p>
            </div>

            <div class="row">
                <label class="label-row" for="avatar">Link ảnh đại diện</label>
                <input id="avatar" type="text" v-model="avatar">
            </div>

            <div class="row">
                <label class="label-row" for="background">Link nền</label>
                <input id="background" type="text" v-model="background">
            </div>

            <div class="row">
                <label class="label-row" for="email">Email</label>
                <input id="email" type="text" v-model="email">
            </div>

            <div class="row">
                <label class="label-row" for="address">Địa chỉ</label>
                <input id="address" type="text" v-model="address">
            </div>

            <div class="row">
                <p class="label-row">Giới tính</p>

                <div class="gender-box">
                    <span>
                        <input id="male" type="radio" name="gender" :value="GENDER.MALE" v-model="gender">
                        <label class="label-value" for="male">Nam</label>
                    </span>

                    <span>
                        <input id="female" type="radio" name="gender" value="female" :value="GENDER.FEMALE"
                            v-model="gender">
                        <label class="label-value" for="female">Nữ</label>
                    </span>

                    <span>
                        <input id="other" type="radio" name="gender" value="other" :value="GENDER.OTHER"
                            v-model="gender">
                        <label class="label-value" for="other">Khác</label>
                    </span>
                </div>
            </div>


            <button class="btn btn-back" @click="back">Quay lại</button>
            <button type="submit" class="btn btn-update-profile" @click="updateProfile">Cập nhật</button>

        </form>
    </div>
</template>


<script>
import accountService from '../services/account.service'

export default {
    data() {
        return {
            username: '',
            password: '',
            lastName: '',
            firstName: '',
            avatar: '',
            background: '',
            email: '',
            address: '',
            gender: ''
        }
    },
    computed: {
        GENDER() {
            return this.$store.state.GENDER
        },
        nameDisplay() {
            return `${this.lastName} ${this.firstName}`
        },
        userLogin() {
            return this.$store.state.account
        }
    },
    methods: {
        fillData() {
            const user = this.userLogin
            this.username = user.username
            this.password = user.password
            this.lastName = user.lastName
            this.firstName = user.firstName
            this.avatar = user.avatar
            this.background = user.background
            this.email = user.email
            this.address = user.address
            this.gender = user.gender
        },
        back() {
            this.$router.back()
        },
        async updateProfile() {
            // [chưa làm] so khớp dữ liệu hiện tại vs dữ liệu cũ
            // hiển thị thông báo cập nhật thành công
            // update dữ liệu client
            // render Profile.vue
            const updateData = {
                username: this.username,
                password: this.password,
                lastName: this.lastName,
                firstName: this.firstName,
                avatar: this.avatar,
                background: this.background,
                email: this.email,
                address: this.address,
                gender: this.gender
            }

            await accountService.updateById(this.userLogin._id, updateData)

            const user = this.userLogin
            for (const prop in updateData) {
                const value = updateData[prop]
                if (user[prop] != value) {
                    user[prop] = value
                }
            }

            this.$router.push({
                name: 'profile',
                params: {
                    'id': this.userLogin._id
                }
            })
        }
    },
    created() {
        this.fillData()
    },
    mounted() {
        document.querySelectorAll('input[type=text]')
            .forEach(inp => {
                inp.onfocus = () => {
                    inp.select()
                }
            })
    }
}
</script>


<style lang="scss" scoped>
.edit-profile {
    padding: 30px 0 100px;

    h1 {
        color: #0950ac;
        text-align: center;
    }

    form {
        width: 600px;
        max-width: 88%;
        font-size: 17px;
        margin: 0 auto;

        .row {
            margin-top: 12px;

            .label-row {
                display: block;
                color: #0950ac;
                font-weight: bold;
                margin-bottom: 4px;
            }

            input[type=text] {
                height: 34px;
                width: 100%;
                border: 2px solid lightgray;
                border-radius: 3px;
                padding: 0 6px;
                font-size: inherit;

                &:focus {
                    border-color: #0950ac;
                }
            }

            .gender-box {
                display: flex;
                justify-content: space-between;

                input[type=radio]:checked+.label-value {
                    font-weight: bold;
                }

                .label-value {
                    padding-left: 4px;
                }
            }
        }

        .btn {
            margin-top: 22px;
            border: none;
            height: 36px;
            font-size: 19px;
            width: 50%;

            &.btn-update-profile {
                background-color: #0950ac;
                color: #fff;
            }

            &.btn-back {
                background-color: #fff;
                color: #0950ac;
            }

            &:hover {
                opacity: 1;
            }

            &,
            &:active {
                opacity: .82;
            }
        }
    }
}
</style>