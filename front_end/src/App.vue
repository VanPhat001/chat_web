<template>
	<!-- <router-link to="/chat-room">goto chat room</router-link> -->

	<router-view :key="$route.fullPath"></router-view>
</template>

<style lang="scss">
</style>

<script>
export default {
	
}
</script>