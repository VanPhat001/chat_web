<template>
    <div class="friend-requests">

        <h1 style="margin: 30px 0 10px;">Lời mời kết bạn</h1>
        <div class="list add-friend-request-list">
            <!-- <router-link class="row add-friend-request" v-for="(request, index) in addFriendRequest" :key="index"
                :to="`/profile/${request}`"> -->
            <router-link class="row add-friend-request" v-for="(request, index) in addFriendRequest" :key="index"
                :to="{name: 'profile', params: {'id': request}}">
                <div class="left">
                    <img class="avatar" :src="getAccount(request).avatar">
                </div>
                <div class="right">
                    <p class="name">{{ fullName(getAccount(request)) }}</p>
                    <button class="btn" @click.prevent="acceptRequest(index)">Đồng ý</button>
                    <button class="btn" @click.prevent="cancelRequest(index)">Hủy</button>
                </div>
            </router-link>
        </div>


    </div>
</template>


<script>
import friendService from '../services/friend.service'
import { mapActions } from 'vuex'
import helper from '../helper'

export default {
    data() {
        return {
            addFriendRequest: []
        }
    },
    computed: {
        accountLogin() {
            return this.$store.state.account
        },
        accountMap() {
            return this.$store.state.accountMap
        }
    },
    methods: {
        ...mapActions(['pushToAccountMap']),

        getAccount(accId) {
            return this.accountMap.get(accId)
        },
        fullName: helper.fullName,
        async cancelRequest(index) {
            try {
                console.log("cancelRequest");
                const accId1 = this.addFriendRequest[index];
                const accId2 = this.accountLogin._id;
                await friendService.deleteByAccount(accId1, accId2);
                this.addFriendRequest.splice(index, 1);
            }
            catch (error) {
                console.log(error);
                alert("Có lỗi xảy ra, hãy thực hiện thao tác này sau...");
            }
        },
        async acceptRequest(index) {
            try {
                console.log("acceptRequest");
                const accId1 = this.addFriendRequest[index];
                const accId2 = this.accountLogin._id;
                const isAccept = true;
                await friendService.updateByAccount(accId1, accId2, isAccept);
                this.addFriendRequest.splice(index, 1);
            }
            catch (error) {
                console.log(error);
                alert("Có lỗi xảy ra, hãy thực hiện thao tác này sau...");
            }
        },
    },
    async created() {
        const accId = this.accountLogin._id
        const addFriendRequest = await friendService.getAllAddFriendRequest(accId)
        console.log(addFriendRequest)

        await this.pushToAccountMap(addFriendRequest)
        this.addFriendRequest = addFriendRequest
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