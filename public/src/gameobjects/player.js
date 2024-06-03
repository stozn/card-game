export default class Player {
    constructor(id, username) {
        this.id = id;
        this.name = username;
        this.bag = 0;
        this.camp = 0;
        this.state ='冒险中';
    }
}