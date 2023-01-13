<template>
	<!-- <router-link to="/chat-room">goto chat room</router-link> -->
	<header v-if="$route.path != '/' && $route.path != '/login'">
		<HeaderComponent></HeaderComponent>
	</header>

	<main>
		<router-view :key="$route.fullPath"></router-view>
	</main>
</template>

<style lang="scss">
header {
	height: 50px;
	background-color: #fff;
}

main {
	height: calc(100vh - 50px);
}
</style>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import LoaddingComponent from './components/LoaddingComponent.vue';

import { mapActions } from 'vuex'
export default {
	components: {
		HeaderComponent,
		LoaddingComponent
	},
	methods: {
		...mapActions(['userOffline'])
	},
	mounted() {
		// tab đóng thì gửi dữ liệu user offline lên cho server
		window.addEventListener('beforeunload', async () => {
			await this.userOffline()
		})
		// !FIXME: nhưng window đóng thì lại không gửi được
		// window.addEventListener('close', async () => {
		// 	await this.userOffline()
		// })
	},
	async unmounted() {
		await this.userOffline()
	}
}
</script>