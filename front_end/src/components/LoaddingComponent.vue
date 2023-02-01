<template >
    <div class="loadding-component">
        <div class="circle"></div>
    </div>
</template>


<script>
export default {

}
</script>


<style lang="scss" scoped>
.loadding-component {
    --background-color: white;
    --color: blue;
    position: fixed;
    inset: 0;
    background-color: var(--background-color);
    z-index: 999;

    display: flex;

    .circle {
        margin: auto;
        width: 112px;
        height: 112px;
        border-radius: 50%;
        // border: 3px solid transparent;
        // border-top-color: blue;

        border: 28px dotted var(--color);

        animation: animation-loadding 2000ms infinite linear;
    }
}


@keyframes animation-loadding {
    to {
        transform: rotate(360deg)
    }
}
</style>