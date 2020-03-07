/*
 * This provides responses to UI input.
 */
import {AnimatedSprite} from "../scene/sprite/AnimatedSprite"
import {SceneGraph} from "../scene/SceneGraph"
import { CircleObject } from "../scene/sprite/CircleObject";
import { ResourceManager } from "../files/ResourceManager";
import { AnimatedSpriteType } from "../scene/sprite/AnimatedSpriteType";

export class UIController {
    private hoveredSprite : AnimatedSprite;
    private spriteToDrag : AnimatedSprite;
    private circleToDrag : CircleObject;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;
    private resourceManager : ResourceManager;
    private hoveredCircle : CircleObject;

    public constructor() {}

    public init(canvasId : string, initScene : SceneGraph, resourseManager: ResourceManager) : void {
        this.hoveredSprite = null

        this.spriteToDrag = null;
        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;
        this.resourceManager = resourseManager;

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mousemove", this.mouseHoverHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        canvas.addEventListener("dblclick", this.mouseDoubleClickHandler);
    }
    public getHoveredSprite() : AnimatedSprite {
        return this.hoveredSprite;
    }
    public getHoveredCircle() : CircleObject{
        return this.hoveredCircle;
    }
    //Mouse over details
    public mouseHoverHandler = (event: MouseEvent) : void => {
        let mouseLocationX : number = event.clientX;
        let mouseLocationY : number = event.clientY;
        this.hoveredSprite = this.scene.getSpriteAt(mouseLocationX, mouseLocationY);
        this.hoveredCircle = this.scene.getCircleObjectAt(mouseLocationX, mouseLocationY)
    }
    //Double click to delete sprites and scene objects
    public mouseDoubleClickHandler = (event: MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circleObject : CircleObject = this.scene.getCircleObjectAt(mousePressX, mousePressY);
        if (sprite != null) {
            this.scene.removeAnimatedSprite(sprite)
        } else if (circleObject != null) {
            this.scene.removeCircleObject(circleObject)
        }
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circleObject: CircleObject = this.scene.getCircleObjectAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        console.log("sprite: " + sprite);
        console.log("hoveredSprite: " + this.hoveredSprite);
        if (sprite != null) {
            // START DRAGGING IT
            this.spriteToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        } else if(circleObject != null){
            this.circleToDrag = circleObject;
            this.dragOffsetX = circleObject.getPosition().getX() - mousePressX;
            this.dragOffsetY = circleObject.getPosition().getY() - mousePressY;
        } else {
            //Generate random sprite
            if (Math.round(Math.random()) == 1){
                //Generate Animated Sprite
                if(Math.round(Math.random()) == 1){
                    //Generate a happyface
                    let spriteTypeToUse : string = 'resources/animated_sprites/RedCircleMan.json';
                    let animatedSpriteType : AnimatedSpriteType = this.resourceManager.getAnimatedSpriteTypeById(spriteTypeToUse);
                    let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, 'FORWARD');
                    spriteToAdd.getPosition().set(mousePressX - 125, mousePressY - 125, 0.0, 1.0);
                    this.scene.addAnimatedSprite(spriteToAdd);       
                } else {
                    let spriteTypeToUse : string = 'resources/animated_sprites/MultiColorBlock.json';
                    let animatedSpriteType : AnimatedSpriteType = this.resourceManager.getAnimatedSpriteTypeById(spriteTypeToUse);
                    let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, 'FORWARD');
                    spriteToAdd.getPosition().set(mousePressX - 125, mousePressY - 125, 0.0, 1.0);
                    this.scene.addAnimatedSprite(spriteToAdd); 
                }
            } else {
                //Generate Circle Object
                let spriteToAdd : CircleObject = new CircleObject(Math.floor(Math.random() * 6))
                spriteToAdd.getPosition().set(mousePressX - 125, mousePressY - 125, 0.0, 1.0);
                this.scene.addCircleObject(spriteToAdd);
            }
        }
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        if (this.spriteToDrag != null) {
            this.spriteToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.spriteToDrag.getPosition().getZ(), 
                                                this.spriteToDrag.getPosition().getW());
        } else if (this.circleToDrag != null){
            this.circleToDrag.getPosition().set(event.clientX + this.dragOffsetX,
                event.clientY + this.dragOffsetY,
                this.circleToDrag.getPosition().getZ(),
                this.circleToDrag.getPosition().getW());
        }
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        this.spriteToDrag = null;
        this.circleToDrag = null;
    }
}