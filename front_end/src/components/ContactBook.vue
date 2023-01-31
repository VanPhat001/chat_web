<template>
    <div class="contact-book">
        <div class="btn" :class="{ 'active': $route.name === 'request' }">
            <router-link :to="{ name: 'request' }">Lời mời kết bạn</router-link>
        </div>

        <div class="btn" :class="{ 'active': $route.name === 'suggest' }">
            <router-link :to="{ name: 'suggest' }">Gợi ý</router-link>
        </div>

        <div class="btn" :class="{ 'active': $route.name === 'friends' }">
            <router-link :to="{ name: 'friends' }">Bạn bè</router-link>
        </div>


        <router-view></router-view>
    </div>
</template>


<script>
export default {
    created() {
        if (this.$route.name === 'contact-book') {
            this.$router.push({name: 'request'})
        }
    }
}
</script>


<style lang="scss" scoped>
.active {
    &>a {
        background-color: rgb(40, 136, 226) !important;
        color: white !important;
    }
}

.contact-book {
    padding: 10px 30px;

    div.btn {
        &>a {
            background-color: rgb(197, 197, 197);
            border-radius: 8px;
            padding: 4px 10px;
            font-size: 16px;
            display: block;

            &:hover {
                background-color: rgb(175, 175, 175)
            }
        }

        &+.btn {
            margin-left: 4px;
        }
    }
}
</style>