<template>
    <div class="edit-profile">
        <form action="" @submit.prevent="">

            <fieldset>
                <label for="">username</label>
                <input type="text" placeholder="username" disabled>
            </fieldset>
            
            <fieldset>
                <label for="">password</label>
                <input type="text" placeholder="password" disabled>
            </fieldset>
            
            <fieldset>
                <input type="text">
                <input type="text">
                <p>Tên hiển thị</p>
            </fieldset>
            
            <fieldset>
                <label for="">Email</label>
                <input type="text">
            </fieldset>
            
            <fieldset>
                <label for="">Địa chỉ</label>
                <input type="text">
            </fieldset>
            
            <fieldset>
                <label for="">Giới tính</label>
                <input type="text">
            </fieldset>
            

        </form>

    </div>
</template>


<script>
export default {
    
}
</script>


<style lang="scss" scoped>
    
</style>