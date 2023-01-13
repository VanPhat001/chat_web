<template>
    <div class="register-component">

        <p class="title">Đăng ký</p>

        <form @submit.prevent="">

            <div class="row">
                <div class="col">
                    <input class="username" id="register-username" type="text" placeholder="username" autofocus>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="password" id="register-password" type="password" placeholder="password">
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="password2" id="register-password2" type="password" placeholder="password">
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="lastname" id="register-lastname" type="text" placeholder="lastname">
                </div>
                <div class="col">
                    <input class="firstname" id="register-firstname" type="text" placeholder="firstname">
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="email" type="text" placeholder="email">
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="address" type="text" placeholder="address">
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input type="radio" name="gender" id="gender-male">
                    <label for="gender-male">Nam</label>
                </div>
                <div class="col">
                    <input type="radio" name="gender" id="gender-female">
                    <label for="gender-female">Nữ</label>
                </div>
                <div class="col">
                    <input type="radio" name="gender" id="gender-other" checked>
                    <label for="gender-other">Khác</label>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <button class="btn" @click="createAccount">Tạo tài khoản</button>
                </div>
            </div>

        </form>

        <div class="btn btn-close" @click="closeModel">
            <i class="fa-solid fa-xmark"></i>
        </div>

    </div>
</template>


<script>
export default {
    emits: ['closeModel'],
    methods: {
        closeModel() {
            this.$emit('closeModel')
        }, 
        createAccount() {
            alert('chưa code :))');
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