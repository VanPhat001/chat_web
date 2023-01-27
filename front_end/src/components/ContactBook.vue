<template>
    <div class="contact-book">
        <div class="btn" :class="{ 'active': $route.path === '/contact-book/request' }">
            <router-link to="/contact-book/request">Lời mời kết bạn</router-link>
        </div>

        <div class="btn" :class="{ 'active': $route.path === '/contact-book/suggest' }">
            <router-link to="/contact-book/suggest">Gợi ý</router-link>
        </div>


        <router-view></router-view>
    </div>
</template>


<script>
export default {
    created() {
        if (this.$route.path === '/contact-book') {
            this.$router.push('/contact-book/request')
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