<template>

    <div class="call-box">
        <video class="stream-video local-video"></video>

        <div class="call-controls">
            <div class="main-box">
                <img class="avatar" :src="userCall?.avatar">
            </div>

            <div class="controls">
                <button class="btn btn-cancel" @click="cancelCall">
                    <i class="fa-solid fa-phone-slash"></i>
                </button>
                <button class="btn" :class="{ 'active': openCamera }" @click="openUserCamera"><i
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
            localStream: null
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
        }

    },
    methods: {
        ...mapActions(['pushToAccountMap']),

        fullName: helper.fullName,

        getAccount(accId) {
            return this.$store.state.accountMap.get(accId)
        },

        cancelCall() {
            window.close()
        },

        openUserCamera() {
            this.openCamera = !this.openCamera

            if (this.openCamera) {
                this.getUserMedia({ video: true, audio: true })
                    .then(localStream => {
                        this.localStream = localStream

                        const el = document.querySelector('.local-video')
                        el.srcObject = localStream
                        el.play()

                        this.socket.emit('open-camera', {
                            caller: this.userLogin._id,
                            receipient: this.getUserCallId,
                            stream: localStream
                        })

                    })
                    .catch(err => console.log(err))
            }
            else {
                this.localStream?.getTracks().forEach((track) => {
                    track.stop()
                })
                this.localStream = null
                document.querySelector('.local-video').srcObject = null

                this.socket.emit('close-camera', {
                    caller: this.userLogin._id,
                    receipient: this.getUserCallId
                })
            }
        },

        openUserMic() {
            this.openMic = !this.openMic
        }
    },
    async created() {
        if (this.userCall === undefined) {
            await this.pushToAccountMap([this.getUserCallId])
        }

        // receive-callId

        if (this.getIsCaller) {
            // ask-callId
            this.socket.emit('ask-callId', {
                caller: this.userLogin._id,
                receipient: this.getUserCallId
            })
            // response-callId
            this.socket.on('response-callId', ({ caller, receipient, callId }) => {
                console.log('receive:', { caller, receipient, callId })
            })
        }

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

    .local-video {
        flex: 1;
        width: 100%;
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