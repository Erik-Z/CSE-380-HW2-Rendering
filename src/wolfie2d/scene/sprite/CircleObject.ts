import {SceneObject} from '../SceneObject'

export class CircleObject extends SceneObject {
    private width : number;
    private height : number;
    private colors : Array<Array<number>>;
    private color : Array<number>;
    public constructor(selector : number) {
        super();
        this.width = 256
        this.height = 256
        this.colors = [
            [255, 0, 255], //Magenta
            [255, 255, 0], //Yellow
            [0, 255, 0], //Green
            [0, 255, 255],//Cyan
            [0, 0, 255], // Blue
            [255, 0, 0]
        ]
        this.color = this.colors[selector];
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
    public getColor() : Array<number> {
        return this.color;
    }

    public getWidth(){
        return this.width;
    }

    public getHeight(){
        return this.height;
    }

    public toString() : string {
        let summary : string =  "{ position: ("
                            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
                            +   "color: (" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ")}"
        return summary;
    }
}