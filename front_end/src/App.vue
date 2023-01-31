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
		background-color: #242526;
		color: white;
		padding: 5px 0;
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
import accountService from './services/account.service';
export default {
	components: {
		HeaderComponent,
		LoaddingComponent
	},
	computed: {
		accountIdStore() {
			return localStorage.getItem('chatweb-accid')
		}
	},
	methods: {
		...mapActions(['userOffline', 'loggedIn'])
	},
	async created() {
		// kiểm tra có tài khoản được lưu trữ hay không
		// - Nếu có: kiểm tra và đăng nhập
		//	  + Nếu tài khoản đúng ---> render current link || render Home.vue
		//	  + Nếu tài khoản sai  ---> render Login.vue
		// - Nếu không: chuyển qua trang đăng nhập ---> render Login.vue
		const accId = this.accountIdStore
		if (accId === null) {
			this.$router.push({name: 'login'})
		}
		else {
			// alert('da co tai khoan dang nhap')
			const account = await accountService.getById(accId)

			const NOT_FOUND = ''
			if (account === NOT_FOUND) {
				this.$router.push({name: 'login'})
			}
			else {
				await this.loggedIn(account)
				console.log('>> dang nhap thanh cong')

				const curUrl = window.location.pathname
				if (curUrl === '/') {
					this.$router.push({name: 'home'})
				}
			}
		}
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