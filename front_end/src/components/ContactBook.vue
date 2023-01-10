<template>
    <div class="contact-book">
        <!-- <h1>contact book page</h1> -->
        <!-- <p>{{ suggestAccountsId }}</p> -->

        <h1>Lời mời kết bạn</h1>
        <div class="list add-friend-request-list">
            <div class="row add-friend-request" v-for="(request, index) in addFriendRequest" :key="index">
                <div class="left">
                    <img class="avatar" :src="getAccount(request).avatar">
                </div>
                <div class="right">
                    <p class="name">{{ fullName(getAccount(request)) }}</p>
                    <button class="btn" @click.prevent="acceptRequest(index)">Đồng ý</button>
                    <button class="btn" @click.prevent="cancelRequest(index)">Hủy</button>
                </div>
            </div>
        </div>

        <h1 style="margin-top: 30px;">Gợi ý</h1>
        <div class="list suggest-list">
            <router-link class="row suggest" v-for="(accId, index) in suggestAccountsId" :key="index"
                :to="`/profile/${accId}`">
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
import accountService from '../services/account.service'
import friendService from '../services/friend.service'

export default {
    data() {
        return {
            suggestAccountsId: [],
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
        getAccount(accId) {
            return this.accountMap.get(accId)
        },
        fullName(account) {
            return `${account.lastName} ${account.firstName}`
        },
        async cancelRequest(index) {
            try {
                console.log('cancelRequest')

                const accId1 = this.addFriendRequest[index]
                const accId2 = this.accountLogin._id

                await friendService.deleteByAccount(accId1, accId2)
                this.addFriendRequest.splice(index, 1)
            } catch (error) {
                console.log(error)
                alert('Có lỗi xảy ra, hãy thực hiện thao tác này sau...')
            }
        },
        async acceptRequest(index) {
            try {
                console.log('acceptRequest')

                const accId1 = this.addFriendRequest[index]
                const accId2 = this.accountLogin._id
                const isAccept = true

                await friendService.updateByAccount(accId1, accId2, isAccept)
                this.addFriendRequest.splice(index, 1)
            } catch (error) {
                console.log(error)
                alert('Có lỗi xảy ra, hãy thực hiện thao tác này sau...')
            }
        },
        async sendAddFriendRequest(index) {
            try {
                console.log('sendAddFriendRequest')

                const accId1 = this.accountLogin._id
                const accId2 = this.suggestAccountsId[index]
                
                // [CHƯA LÀM] kiểm trac acc1 có gửi lời mời kết bạn cho acc2 chưa
                // và acc2 có gửi cho acc1 chưa
                //  - Nếu có lời mời rồi thì chuyển isAccept thành true
                //  - Nếu chưa có lời mời thì tạo mới friendObj cho collection

                await friendService.create(accId1, accId2)
                this.suggestAccountsId.splice(index, 1)
            } catch (error) {
                console.log(error)
                alert('Có lỗi xảy ra, hãy thực hiện thao tác này sau...')
            }
        }
    },

    async created() {
        const accId = this.accountLogin._id

        // lấy thông tin những accId gửi lời mời kết bạn và thông tin accId gợi í kết bạn
        // 2 mảng này có khả năng có phần tử trùng nhau
        //#region
        const [addFriendRequest, suggestAccountsId]
            = await Promise.all([
                friendService.getAllAddFriendRequest(accId),
                accountService.suggestAccount(accId)
            ])
        //#endregion


        // loại bỏ phần tử trùng nhau của suggestAccountsId
        //#region
        const set = new Set(addFriendRequest)
        for (let i = suggestAccountsId.length - 1; i >= 0; i--) {
            const el = suggestAccountsId[i]
            if (set.has(el)) {
                let temp = suggestAccountsId[i]
                suggestAccountsId[i] = suggestAccountsId[suggestAccountsId.length - 1]
                suggestAccountsId[suggestAccountsId.length - 1] = temp
                suggestAccountsId.pop()
            }
        }
        //#endregion

        console.log({ addFriendRequest, suggestAccountsId });

        // fetch dữ liệu account về và lưu trữ trong store
        //#region 
        const accountMap = this.accountMap // tham chiếu accountMap đến $store.state.accountMap
        const tasks = []
        addFriendRequest.concat(suggestAccountsId).forEach(accId => {
            if (!accountMap.has(accId)) {
                tasks.push(accountService.getById(accId))
            }
        })

        const accounts = await Promise.all(tasks)

        accounts.forEach(acc => {
            accountMap.set(acc._id, acc)
        })
        //#endregion

        this.suggestAccountsId = suggestAccountsId
        this.addFriendRequest = addFriendRequest
    },
}
</script>


<style lang="scss" scoped>
.contact-book {
    height: 100%;
    overflow-y: auto;
}

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