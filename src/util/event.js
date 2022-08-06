import { onMounted, onUnmounted } from 'vue'

export function event(target) {
    target = target || window;
    return {
        when(event) {
            return {
                then(callback) {
                    onMounted(() => target.addEventListener(event, callback));
                    onUnmounted(() => target.removeEventListener(event, callback));
                }
            }
        }
    }
}