<template>
	<div class="app">
		<header v-if="$route.path != '/' && $route.path != '/login'">
			<HeaderComponent></HeaderComponent>
		</header>

		<main>
			<router-view :key="$route.fullPath"></router-view>
		</main>
	</div>
</template>

<style lang="scss">
.app {
	display: flex;
	flex-direction: column;
	height: 100vh;
	overflow: hidden;

	header {
		height: 50px;
		background-color: #fff;
	}

	main {
		flex: 1;
		overflow: auto;
	}
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