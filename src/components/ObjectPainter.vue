
<template>
    <div class="container">
        <div class="colorPicker" :class="{ selected: color == controls.selectedColor }" v-for="color in colors"
            :style="{ backgroundColor: color }" @click="$emit('onSetBlock', color); controls.selectedColor = color"></div>
    </div>
</template>

<script>
export default {
    props: ['brickSize'],
    data() {
        return {
            controls: {
                selectedColor: null,
                selectedIndex: 0,
                selectedAxis: 'x',
            },
            matrix: [],
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
        selectedArray() {
            if (this.controls.selectedAxis == 'x') {
                return this.matrix[this.controls.selectedIndex];
            }
            if (this.controls.selectedAxis == 'y') {
                return this.matrix.map(a => a[this.controls.selectedIndex]);
            }
            if (this.controls.selectedAxis == 'z') {
                return this.matrix.map(a => a.map(b => b[this.controls.selectedIndex]));
            }
        }
    },
    created() {
        for (let i = 0; i < this.brickSize; i++) {
            this.matrix.push([]);
            for (let j = 0; j < this.brickSize; j++) {
                this.matrix[i].push([]);
                for (let k = 0; k < this.brickSize; k++) {
                    this.matrix[i][j].push({ color: null, pos: { x: i, y: j, z: k } });
                }
            }
        }
        console.log(this.matrix);
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
            border: 1px solid pink;
        }
    }
}
</style>
