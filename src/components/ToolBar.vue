
<template>
    <div class="container">
        <div class="toolButton" v-for="button in buttons" @click="button.action">
            <font-awesome-icon style="font-size: 30px;" inverse :icon="button.icon" />
        </div>
    </div>
</template>

<script>
export default {
    props: ['buttons'],
    data() {
        return {
        }
    },
    computed: {
    },
    created() {
    },
}
</script>

<style scoped lang="scss">
.container {
    position: absolute;
    left: 20px;
    top: calc(50% - 362.5px);
    background-color: chocolate;
    /* height: 720px; */
    /* width: 50px; */
    border-radius: 10px;
    padding-left: 10px;
    padding-bottom: 10px;

    .toolButton {
        /* height: 40px; */
        /* width: 40px; */
        margin-top: 10px;
        margin-right: 10px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
