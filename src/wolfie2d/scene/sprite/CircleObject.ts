import {SceneObject} from '../SceneObject'

export class CircleObject extends SceneObject {
    private width : number;
    private height : number;
    private color : Array<number>;

    public constructor() {
        super();
        this.width = 256
        this.height = 256
        this.color = [1, 0, 1, 1]
    }

    public contains(pointX: number, pointY: number): boolean {
        let spriteWidth = this.getWidth();
        let spriteHeight = this.getHeight();
        let spriteLeft = this.getPosition().getX();
        let spriteRight = this.getPosition().getX() + spriteWidth;
        let spriteTop = this.getPosition().getY();
        let spriteBottom = this.getPosition().getY() + spriteHeight;
        if (    (pointX < spriteLeft)
            ||  (spriteRight < pointX)
            ||  (pointY < spriteTop)
            ||  (spriteBottom < pointY)) {
                return false;
        }
        else {
            return true;
        }
    }

    public getWidth(){
        return this.width;
    }

    public getHeight(){
        return this.height;
    }
}