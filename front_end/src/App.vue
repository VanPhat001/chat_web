<template>
	<div class="app">
		<header v-if="$route.path != '/' && $route.path != '/login'">
			<HeaderComponent></HeaderComponent>
		</header>

		<main>
			<IncommingCall v-if="showIncommingCall" class="incomming-call" :pAccId="$store.state.userCallId"
				@onAcceptCall="acceptCall" @onCancelCall="rejectCall"></IncommingCall>
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
		position: relative;

		.incomming-call {
			position: absolute;
			top: 2px;
			left: 50%;
			transform: translate(-50%, 0);
			z-index: 1;

			animation: open .44s linear;
			box-shadow: 0 0 10px rgb(90, 86, 86);
		}

	}

}

@keyframes open {
	from {
		transform: translate(-50%, -100%);
		opacity: .3;
	}
}
</style>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
import LoaddingComponent from './components/LoaddingComponent.vue'
import IncommingCall from './components/IncommingCall.vue'

import { mapActions, mapMutations } from 'vuex'
import accountService from './services/account.service';
export default {
	components: {
		HeaderComponent,
		LoaddingComponent,
		IncommingCall
	},
	computed: {
		accountIdStore() {
			return localStorage.getItem('chatweb-accid')
		},
		showIncommingCall() {
			return this.$store.state.showIncommingCall
		},
		socket() {
			return this.$store.state.socket
		}
	},
	methods: {
		...mapActions(['userOffline', 'loggedIn']),
		...mapMutations(['setShowIncommingCall']),

		acceptCall(userCallId) {
			console.log('accept', userCallId)

			this.setShowIncommingCall(false)


			this.$router.push({
				name: 'call',
				params: {
					userId: userCallId,
					isCaller: false
				}
			})

			// const routeData = this.$router.resolve({
			// 	name: 'call',
			// 	params: {
			// 		userId: userCallId,
			// 		isCaller: false
			// 	}
			// })
			// window.open(routeData.href, '', `width=${window.outerWidth},height=${window.outerHeight}`)
		},

		rejectCall(userCallId) {
			console.log('reject-call', userCallId)

			this.setShowIncommingCall(false)

			this.socket.emit('reject-call', {
				from: this.$store.state.account._id,
				to: userCallId
			})
		}
	},
	async created() {
		// ki???m tra c?? t??i kho???n ???????c l??u tr??? hay kh??ng
		// - N???u c??: ki???m tra v?? ????ng nh???p
		//	  + N???u t??i kho???n ????ng ---> render current link || render Home.vue
		//	  + N???u t??i kho???n sai  ---> render Login.vue
		// - N???u kh??ng: chuy???n qua trang ????ng nh???p ---> render Login.vue
		const accId = this.accountIdStore
		if (accId === null) {
			this.$router.push({ name: 'login' })
		}
		else {
			// alert('da co tai khoan dang nhap')
			const account = await accountService.getById(accId)

			const NOT_FOUND = ''
			if (account === NOT_FOUND) {
				this.$router.push({ name: 'login' })
			}
			else {
				await this.loggedIn(account)
				console.log('>> dang nhap thanh cong')

				const curUrl = window.location.pathname
				if (curUrl === '/') {
					this.$router.push({ name: 'home' })
				}
			}
		}
	},
	mounted() {
		// tab ????ng th?? g???i d??? li???u user offline l??n cho server
		window.addEventListener('beforeunload', async () => {
			await this.userOffline()
		})
		// !FIXME: nh??ng window ????ng th?? l???i kh??ng g???i ???????c
		// window.addEventListener('close', async () => {
		// 	await this.userOffline()
		// })
	},
	async unmounted() {
		await this.userOffline()
	}
}
</script>