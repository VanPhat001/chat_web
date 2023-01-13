<template>
    <div ref="dropdown-component" class="dropdown-component">
        <slot></slot>
    </div>
</template>


<script>
export default {
    emits: ['loaded'],

    props: {
        pOpen: { type: Boolean, default: false }
    },

    computed: {
        isOpen() {
            return !this.$refs['dropdown-component'].classList.contains('close')
        }
    },

    methods: {
        open() {
            this.$refs['dropdown-component'].classList.remove('close')
        },

        close() {
            this.$refs['dropdown-component'].classList.add('close')
        },
    },

    mounted() {
        this.close()
        this.$emit('loaded')
    },

    watch: {
        pOpen() {
            if (this.pOpen) {
                this.open()
                console.log('open')
            }
            else {
                this.close()
                console.log('close')
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.close {
    display: none;
}

.dropdown-component {
    --arrow-x: 0px;
    --arrow-y: -2px;
    --edge-height: 15px;
    --edge-width: 100%;
    --edge-color: tranparent;
    --arrow-size: 14px;
    --arrow-color: green;

    border-radius: 4px;
    position: relative;
    padding: 10px;

    &::before {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        height: var(--edge-height);
        width: var(--edge-width);
        background-color: var(--edge-color);
    }

    &::after {
        content: "";
        position: absolute;
        bottom: calc(100% + var(--arrow-y));
        left: var(--arrow-x);

        border: var(--arrow-size) solid transparent;
        border-bottom-color: var(--arrow-color);
    }
}
</style>