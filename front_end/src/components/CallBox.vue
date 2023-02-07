<template>

    <div class="call-box">
        <video class="stream-video local-video"></video>
        <video src="" class="stream-video remote-video"></video>

        <div class="call-controls">
            <div class="main-box">
                <img class="avatar" :src="userCall?.avatar">
            </div>

            <div class="controls">
                <button class="btn btn-cancel" @click="cancelCall">
                    <i class="fa-solid fa-phone-slash"></i>
                </button>
                <button class="btn" :class="{ 'active': openCamera }" @click="changeStateUserCamera"><i
                        class="fa-solid fa-camera"></i></button>
                <button class="btn" :class="{ 'active': openMic }" @click="openUserMic"><i
                        class="fa-solid fa-microphone"></i></button>
                <button class="btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
        </div>
    </div>

</template>


<script>
import { mapActions } from 'vuex';
import helper from '../helper';
export default {
    data() {
        return {
            openCamera: false,
            openMic: false,
            localStream: null,
            remoteCallId: null,
            remoteStream: null,
        }
    },
    computed: {
        getUserCallId() {
            return this.$route.params.userId
        },
        getIsCaller() {
            const value = this.$route.params.isCaller
            return value == 'true'
        },
        userLogin() {
            return this.$store.state.account
        },
        userCall() {
            return this.getAccount(this.getUserCallId)
        },
        getUserMedia() {
            return navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        },
        socket() {
            return this.$store.state.socket
        },
        localVideo() {
            return document.querySelector('.local-video')
        },
        remoteVideo() {
            return document.querySelector('.remote-video')
        },
        peer() {
            return this.$store.state.peer
        }

    },
    methods: {
        ...mapActions(['pushToAccountMap']),

        fullName: helper.fullName,

        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },

        cancelCall() {
            // window.close()
            this.socket.emit('finish-call', {
                from: this.userLogin._id,
                to: this.getUserCallId
            })
            this.$router.go(-1)
        },

        changeStateUserCamera() {
            this.openCamera ? this.closeUserCamera() : this.openUserCamera()
        },

        async openUserCamera() {
            this.openCamera = true

            try {
                const localStream = await this.getUserMedia({ video: true, audio: true })
                this.localStream = localStream

                const video = this.localVideo
                video.srcObject = localStream
                video.onloadedmetadata = () => {
                    video.play()
                }


                // this.socket.emit('open-camera', {
                //     caller: this.userLogin._id,
                //     receipient: this.getUserCallId,
                //     stream: localStream
                // })
            } catch (error) { console.log(error) }
        },

        closeUserCamera() {
            this.openCamera = false

            this.localStream?.getTracks().forEach((track) => {
                track.stop()
            })
            this.localStream = null
            this.localVideo.srcObject = null

            // this.socket.emit('close-camera', {
            //     caller: this.userLogin._id,
            //     receipient: this.getUserCallId
            // })
        },

        openUserMic() {
            this.openMic = !this.openMic
        },

        async connectToCaller() {
            await this.openUserCamera()

            const call = this.peer.call(this.remoteCallId, this.localStream)
            call.on('stream', remoteStream => {
                this.remoteStream = remoteStream

                const video = this.remoteVideo
                video.srcObject = this.remoteStream
                video.onloadedmetadata = () => {
                    video.play()
                }
            })
        },

        async answerCaller() {
            await this.openUserCamera()

            this.peer.on('call', async call => {
                call.answer(this.localStream)

                call.on('stream', remoteStream => {
                    this.remoteStream = remoteStream

                    const video = this.remoteVideo
                    video.srcObject = this.remoteStream
                    video.onloadedmetadata = () => {
                        video.play()
                    }
                })
            })
        }
    },

    async created() {
        if (this.userCall === undefined) {
            await this.pushToAccountMap([this.getUserCallId])
        }

        this.socket.on('finish-call', ({ from, to }) => {
            this.$router.go(-1)
        })

        this.socket.on('reject-call', ({ from, to }) => {
            this.socket.off('reject-call')

            this.$router.go(-1)
        })

        if (this.getIsCaller) {
            // ask-callId
            this.socket.emit('ask-callId', {
                caller: this.userLogin._id,
                receipient: this.getUserCallId
            })
            // response-callId
            this.socket.on('response-callId', async ({ caller, receipient, callId }) => {
                this.socket.off('response-callId')

                this.remoteCallId = callId
                console.log('receive:', { caller, receipient, callId })
            })
        }
        else {
            this.socket.emit('ready-stream', {
                from: this.userLogin._id,
                to: this.getUserCallId
            })

            await this.answerCaller()
        }
    },

    mounted() {
        console.log('rendered')

        this.socket.on('ready-stream', ({ from, to }) => {
            this.connectToCaller()
        })
    },

    watch: {
        remoteStream() {
            if (this.remoteStream) {
                document.querySelector('.avatar').style.display = 'none'
            }
        }
    },

    unmounted() {
        this.socket.off('response-callId')
        this.socket.off('finish-call')
        this.socket.off('reject-call')
        this.socket.off('ready-stream')

        this.localStream?.getTracks().forEach((track) => {
            track.stop()
        })
        this.remoteStream?.getTracks().forEach((track) => {
            track.stop()
        })
    }
}
</script>


<style lang="scss" scoped>
video.stream-video {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
}

.call-box {
    background-color: powderblue;
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;

    .remote-video {
        flex: 1;
        width: 100%;
    }

    .local-video {
        border-radius: 3px;
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 1;

        max-width: 240px;
    }

    .call-controls {
        position: absolute;
        top: 0;
        left: 0;

        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;

        .main-box {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;

            .avatar {
                --size: 172px;
                width: var(--size);
                height: var(--size);
                border-radius: 50%;

                animation: calling 2s linear infinite;
            }

            @keyframes calling {
                0% {
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.9);
                }

                20% {
                    box-shadow: 0 0 0 18px rgba(255, 255, 255, 0.66),
                        0 0 0 8px rgba(255, 255, 255, 0.9);
                }

                70% {
                    box-shadow: 0 0 0 42px rgba(255, 255, 255, 0),
                        0 0 0 30px rgba(255, 255, 255, 0);
                }
            }
        }

        .controls {
            padding-bottom: 44px;
            text-align: center;

            .btn {
                font-size: 20px;
                --size: 54px;
                width: var(--size);
                height: var(--size);
                line-height: var(--size);
                border-radius: 50%;
                text-align: center;
                border: none;
                transition: all .3s linear;

                &:not(:first-child) {
                    margin-left: 12px;
                }

                &-cancel {
                    background-color: rgb(212, 0, 0);
                    color: white;
                }

                &.active {
                    background-color: rgb(18, 18, 168);
                    color: white;
                }
            }
        }
    }
}
</style>