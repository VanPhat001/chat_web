<template>
    <div class="emoji-picker">
        <EmojiPicker :native="true" @select="onSelectEmoji" />
    </div>
</template>


<script>
import EmojiPicker from 'vue3-emoji-picker'
import '../../node_modules/vue3-emoji-picker/dist/style.css'
export default {
    emits: ['onSelectEmoji'],
    components: {
        EmojiPicker
    },
    methods: {
        onSelectEmoji(emoji) {
            // console.log(emoji)

            const data = {
                icon: emoji.i,
                withSkinTone: emoji.r,
                skinTone: emoji.t,
                withoutTone: emoji.u,
            }
            this.$emit('onSelectEmoji', data)
            /*
              // result
              { 
                  i: "😚", 
                  n: ["kissing face"], 
                  r: "1f61a", // with skin tone
                  t: "neutral", // skin tone
                  u: "1f61a" // without tone
              }
              */
        }
    }
}
</script>



<style lang="scss" scoped>
</style>