
<template>
    <div class="container">
        <div class="colorPicker" :class="{ selected: color == controls.selectedColor }" v-for="color in colors"
            :style="{ backgroundColor: color }" @click="$emit('onSetBlock', color); controls.selectedColor = color">
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            controls: {
                selectedColor: "#ffffff",
            },
            colors: [
                "#000000",
                "#575757",
                "#a0a0a0",
                "#ffffff",
                "#2a4bd7",
                "#1d6914",
                "#814a19",
                "#8126c0",
                "#9dafff",
                "#81c57a",
                "#e9debb",
                "#ad2323",
                "#29d0d0",
                "#ffee33",
                "#ff9233",
                "#ffcdf3"
            ]
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
    display: flex;
    bottom: 20px;
    left: calc(50% - 362.5px);
    background-color: chocolate;
    height: 50px;
    width: 720px;
    border-radius: 10px;
    padding-left: 5px;

    .colorPicker {
        height: 40px;
        width: 40px;
        margin-top: 5px;
        margin-right: 5px;
        border-radius: 5px;
        cursor: pointer;

        &.selected {
            border: 2px solid red;
            height: 36px;
            width: 36px;
        }
    }
}
</style>
