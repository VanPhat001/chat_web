<template>
	<!-- <router-link to="/chat-room">goto chat room</router-link> -->

	<header v-if="$route.path !== '/' && $route.path !== '/login'">
		<HeaderComponent></HeaderComponent>
	</header>

	<main>
		<router-view :key="$route.fullPath"></router-view>
	</main>
</template>

<style lang="scss">
header {
	height: 50px;
}

main {
	height: calc(100vh - 50px);
}
</style>

<script>
import HeaderComponent from './components/HeaderComponent.vue';
export default {
	components: {
		HeaderComponent
	}
}
</script>