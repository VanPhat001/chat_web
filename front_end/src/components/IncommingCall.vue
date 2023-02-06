<template>
    <div class="incomming-call">
        <img class="avatar" :src="account.avatar">
        <p class="name">{{ fullName(account) }}</p>
        <button class="btn btn-accept" @click="acceptCall">
            <i class="fa-solid fa-phone"></i>
        </button>
        <button class="btn btn-cancel" @click="cancellCall">
            <i class="fa-solid fa-phone-slash"></i>
        </button>
    </div>
</template>


<script>
import { mapActions } from 'vuex'
import helper from '../helper'
export default {
    emits: ['onCancelCall', 'onAcceptCall'],
    props: {
        pAccId: {
            type: String,
            require: true
        }
    },
    data() {
        return {
            account: {}
        }
    },
    computed: {
        accId() {
            return this.pAccId
        }
    },
    methods: {
        ...mapActions(['pushToAccountMap']),

        fullName: helper.fullName,

        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },

        acceptCall() {
            this.$emit('onAcceptCall', this.accId)
        },

        cancellCall() {
            this.$emit('onCancelCall', this.accId)
        }
    },
    async created() {
        let acc = this.getAccount(this.accId)
        if (acc === undefined) {
            await this.pushToAccountMap([this.accId])
            acc = this.getAccount(this.accId)
        }

        this.account = acc
    }
}
</script>


<style lang="scss" scoped>
.incomming-call {
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 12px 24px;
    border-radius: 3px;
    background-color: #242526;
    color: white;

    .avatar {
        --size: 54px;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
    }

    .name {
        font-size: 22px;
        font-weight: bold;
        padding: 0 60px 0 6px;
    }

    .btn {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: white;
        border: none;

        &:not(:first-child) {
            margin-left: 6px;
        }

        &.btn-accept {
            background-color: blue;
        }

        &.btn-cancel {
            background-color: red;
            // transform: rotate(-45deg);
        }
    }

}
</style>