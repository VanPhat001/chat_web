<template>
    <div ref="expand-box" class="expand-box">
        <button class="btn btn-more">
            <i class="fa-solid fa-ellipsis-vertical"></i>

            <div class="more-box">
                <button class="btn btn-unsend" @click="unsendMessage">xóa/thu hồi</button>
            </div>
        </button>

        <button class="btn btn-react">
            <i class="fa-solid fa-face-laugh-squint"></i>

            <div class="react-box">
                <span class="btn" title="thích" @click="reactHandle">👍</span>
                <span class="btn" title="tym" @click="reactHandle">💝</span>
                <span class="btn" title="haha" @click="reactHandle">😂</span>
                <span class="btn" title="wow" @click="reactHandle">😮</span>
                <span class="btn" title="buồn" @click="reactHandle">😥</span>
                <span class="btn" title="giận dữ" @click="reactHandle">😡</span>
            </div>
        </button>

        <button class="btn btn-response" @click="responseHandle">
            <i class="fa-solid fa-share"></i>
        </button>

    </div>
</template>


<script>
export default {
    emits: ['unsend', 'react', 'response'],
    computed: {
        expandBoxElement() {
            return this.$refs['expand-box']
        }
    },
    methods: {
        unsendMessage() {
            this.$emit('unsend', { target: this.expandBoxElement })
        },
        reactHandle() {
            this.$emit('react', { target: this.expandBoxElement })
        },
        responseHandle() {
            this.$emit('response', { target: this.expandBoxElement })
        },
    }
}
</script>


<style lang="scss" scoped>
.expand-box {
    --color: black;
    --box-color: blue;
    display: flex;

    .btn-more,
    .btn-react,
    .btn-response {
        border: none;
        background-color: transparent;
        border-radius: 50%;
        color: var(--color);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;

        &:hover {
            background-color: #00000042;
        }
    }

    .btn-more {
        position: relative;

        .more-box {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 1;
            display: none;

            padding: 4px;
            background-color: #000000dc;

            &::before {
                content: "";
                position: absolute;
                bottom: 100%;
                left: 0;
                width: 100%;
                height: 5px;
                background-color: transparent;
            }

            .btn-unsend {
                padding: 5px 10px;
                white-space: nowrap;
                font-weight: bold;
            }
        }

        &:hover .more-box {
            display: block;
            animation: box-down;
            animation-timing-function: linear;
            animation-duration: 300ms;
            animation-fill-mode: both;
            animation-iteration-count: 1;
        }
    }

    .btn-react {
        position: relative;

        .react-box {
            position: absolute;
            bottom: 98%;
            left: 50%;
            transform: translate(-50%, 0);

            background-color: var(--box-color);
            border-radius: 4px;
            display: none;

            .btn {
                padding: 2px;
                zoom: 1.4;


                &:hover {
                    animation: emoji-up;
                    animation-timing-function: linear;
                    animation-duration: 300ms;
                    animation-fill-mode: both;
                    animation-iteration-count: 1;
                }
            }
        }

        &:hover .react-box {
            display: flex;

            animation: box-up;
            animation-timing-function: ease;
            animation-duration: 280ms;
            animation-fill-mode: both;
            animation-iteration-count: 1;
        }
    }
}

.expand-box.reverse {
    flex-direction: row-reverse;
}

@keyframes box-up {
    0% {
        opacity: 0.3;
        bottom: 40%;
    }
}

@keyframes box-down {
    0% {
        opacity: 0.3;
        top: 40%;
    }
}

@keyframes emoji-up {
    50% {
        transform: translate(0, -20%);
    }
}
</style>