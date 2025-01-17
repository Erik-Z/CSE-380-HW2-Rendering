import {SceneObject} from './SceneObject'
import {AnimatedSprite} from './sprite/AnimatedSprite'
import { CircleObject } from './sprite/CircleObject';

export class SceneGraph {
    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private animatedSprites : Array<AnimatedSprite>;
    private circleObjects: Array<CircleObject>;

    // SET OF VISIBLE OBJECTS, NOTE THAT AT THE MOMENT OUR
    // SCENE GRAPH IS QUITE SIMPLE, SO THIS IS THE SAME AS
    // OUR LIST OF ANIMATED SPRITES
    private visibleSet : Array<SceneObject>;
    private circleVisibleSet : Array<SceneObject>;

    public constructor() {
        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.animatedSprites = new Array();
        this.visibleSet = new Array();
        this.circleObjects = new Array();
        this.circleVisibleSet = new Array();
    }

    public getNumSprites() : number {
        return this.animatedSprites.length + this.circleObjects.length;
    }

    public addAnimatedSprite(sprite : AnimatedSprite) : void {
        this.animatedSprites.push(sprite);
    }

    public addCircleObject(sprite : CircleObject) : void {
        this.circleObjects.push(sprite);
    }

    public getSpriteAt(testX : number, testY : number) : AnimatedSprite {
        for (let sprite of this.animatedSprites) {
            if (sprite.contains(testX, testY))
                return sprite;
        }
        return null;
    }

    public getCircleObjectAt(testX: number, testY: number): CircleObject{
        for(let sprite of this.circleObjects){
            if(sprite.contains(testX, testY)){
                return sprite;
            }
        }
    }

    public removeAnimatedSprite(sprite : AnimatedSprite) : void{
        let index : number = this.animatedSprites.indexOf(sprite)
        this.animatedSprites.splice(index, 1)
    }

    public removeCircleObject(sprite : CircleObject) : void {
        let index : number = this.circleObjects.indexOf(sprite)
        this.circleObjects.splice(index, 1)
    }

    /**
     * update
     * 
     * Called once per frame, this function updates the state of all the objects
     * in the scene.
     * 
     * @param delta The time that has passed since the last time this update
     * funcation was called.
     */
    public update(delta : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.update(delta);
        }
    }

    public scope() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.animatedSprites) {
            this.visibleSet.push(sprite);
        }

        return this.visibleSet;
    }

    public circleScope() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.circleVisibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.circleObjects) {
            this.circleVisibleSet.push(sprite);
        }

        return this.circleVisibleSet;
    }
}