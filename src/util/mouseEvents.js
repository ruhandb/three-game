import { event } from './event';

export function mouseEvents() {
    return {
        leftClick(){
            return {
                then(callback){
                    event().when('mousedown').then(e => {
                        if (e.button === 0) {
                            callback(e);
                        }
                    })
                }
            }
        },
        rightClick(){
            return {
                then(callback){
                    event().when('mousedown').then(e => {
                        if (e.button === 2) {
                            callback(e);
                        }
                    })
                }
            }
        }
    }
}