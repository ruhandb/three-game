export default class DataService {
    setData(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }
    getData(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }
}