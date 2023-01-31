<template>
    <div class="suggest-friends">
        <h1 style="margin: 30px 0 10px;">Gợi ý</h1>
        <div class="list suggest-list">
            <router-link class="row suggest" v-for="(accId, index) in suggestAccountsId" :key="index"
                :to="{ name: 'profile', params: { 'id': accId } }">
                <div class="left">
                    <img class="avatar" :src="getAccount(accId).avatar">
                </div>
                <div class="right">
                    <p class="name">{{ fullName(getAccount(accId)) }}</p>
                    <button class="btn" @click.prevent="sendAddFriendRequest(index)">Thêm bạn bè</button>
                </div>
            </router-link>
        </div>
    </div>
</template>


<script>
import accountService from '../services/account.service';
import friendService from '../services/friend.service';
import { mapActions } from 'vuex';
import helper from '../helper';

export default {
    data() {
        return {
            suggestAccountsId: []
        }
    },
    computed: {
        accountLogin() {
            return this.$store.state.account;
        },
        accountMap() {
            return this.$store.state.accountMap;
        }
    },
    methods: {
        ...mapActions(['pushToAccountMap']),

        getAccount(accId) {
            return this.accountMap.get(accId);
        },
        fullName: helper.fullName,
        async sendAddFriendRequest(index) {
            try {
                console.log("sendAddFriendRequest");
                const accId1 = this.accountLogin._id;
                const accId2 = this.suggestAccountsId[index];
                // [CHƯA LÀM] kiểm trac acc1 có gửi lời mời kết bạn cho acc2 chưa
                // và acc2 có gửi cho acc1 chưa
                //  - Nếu có lời mời rồi thì chuyển isAccept thành true
                //  - Nếu chưa có lời mời thì tạo mới friendObj cho collection
                await friendService.create(accId1, accId2);
                this.suggestAccountsId.splice(index, 1);
            }
            catch (error) {
                console.log(error);
                alert("Có lỗi xảy ra, hãy thực hiện thao tác này sau...");
            }
        }
    },
    async created() {
        const accId = this.accountLogin._id;
        // !FIXME: đã gửi yêu cầu nhưng vẫn xuất hiện ở phần gợi ý
        const suggestAccountsId = await accountService.suggestAccount(accId)

        console.log(suggestAccountsId)
        await this.pushToAccountMap(suggestAccountsId)
        this.suggestAccountsId = suggestAccountsId
    }
}
</script>


<style lang="scss" scoped>
.list {
    .row {
        display: flex;
        width: fit-content;

        .left {
            .avatar {
                height: 74px;
                width: 74px;
                border-radius: 50%;
            }
        }

        .right {
            flex: 1;
            padding-left: 8px;

            .name {
                font-size: 20px;
                font-weight: bold;
            }

            button {
                margin-top: 5px;
                border: none;
                background-color: rgb(22, 64, 179);
                padding: 8px 20px;
                color: white;
                font-weight: bold;
                font-size: 16px;
                opacity: .8;

                &:hover {
                    opacity: 1;
                }

                &:not(:first-child) {
                    margin-left: 4px;
                }
            }
        }
    }
}
</style>