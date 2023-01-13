<template>
    <div class="account-list">
        <ul>
            <li v-for="(account, index) in accounts" @click="selectAccount(index)">
                <img class="avatar" :src="account.avatar">
                <p class="name">{{ getFullName(account) }}</p>
            </li>
        </ul>
    </div>
</template>


<script>
export default {
    emits: ['loaded'],
    props: {
        pAccounts: { type: Array, default: [] }
    },
    data() {
        return {
            accounts: [],
        }
    },
    methods: {
        getFullName(account) {
            return account.lastName + " " + account.firstName
        },
        selectAccount(index) {
            this.$emit('selectAccount', index)
        }
    },
    mounted() {
        this.$emit('loaded')
    },
    watch: {
        pAccounts() {
            this.accounts = this.pAccounts
        }
    },
}
</script>



<style lang="scss" scoped>
.account-list {
    ul {
        height: 100%;
        overflow-y: auto;

        li {
            display: flex;
            align-items: center;
            border: 2px solid transparent;
            cursor: pointer;

            &:hover {
                border-color: red;
            }

            &:not(:first-child) {
                margin-top: 10px;
            }

            .avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }

            .name {
                margin-left: 8px;
                display: inline-block;
                font-weight: bold;
                font-size: 22px;
            }
        }
    }
}
</style>