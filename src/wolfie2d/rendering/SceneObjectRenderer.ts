import {WebGLGameShader} from './WebGLGameShader'
import {MathUtilities} from '../math/MathUtilities'
import { Matrix } from '../math/Matrix'
import { Vector3 } from '../math/Vector3'
import {WebGLGameTexture} from './WebGLGameTexture'
import {HashTable} from '../data/HashTable'
import { CircleObject } from '../scene/sprite/CircleObject'

var SpriteDefaults = {
    A_POSITION: "a_Position",
    A_TEX_COORD: "a_TexCoord",
    U_SPRITE_TRANSFORM: "u_SpriteTransform",
    U_TEX_COORD_FACTOR: "u_TexCoordFactor",
    U_TEX_COORD_SHIFT: "u_TexCoordShift",
    U_SAMPLER: "u_Sampler",
    NUM_VERTICES: 4,
    FLOATS_PER_VERTEX: 2,
    FLOATS_PER_TEXTURE_COORDINATE: 2,
    TOTAL_BYTES: 16,
    VERTEX_POSITION_OFFSET: 0,
    TEXTURE_COORDINATE_OFFSET: 8,
    INDEX_OF_FIRST_VERTEX: 0
};
export class GradientCircleRenderer {
    private shader : WebGLGameShader;
    private vertexTexCoordBuffer : WebGLBuffer;

    // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
    private circleTransform : Matrix;
    private circleTranslate : Vector3;
    private circleRotate : Vector3;
    private circleScale : Vector3;    

    private webGLAttributeLocations : HashTable<GLuint>;
    private webGLUniformLocations : HashTable<WebGLUniformLocation>;

    public constructor() {}
    
    public init(webGL : WebGLRenderingContext) : void {
        this.shader = new WebGLGameShader();
        var vertexShaderSource =
        'precision highp float;\n' +   
        'attribute vec4 a_Position;\n' +
        'attribute vec2 a_ValueToInterpolate;\n' +
        'varying vec2 val;\n' +
        'uniform mat4 u_SpriteTransform;\n' +
        'void main() {\n' +
        '  val = a_ValueToInterpolate;\n' +
        '  gl_Position = u_SpriteTransform * a_Position;\n' +
        '}\n';
        var fragmentShaderSource = 
            'precision highp float;\n'+
            'varying vec2 val;\n'+
            'void main() {\n' +
            '  float R = 0.5;\n' +
            '  float dist = sqrt(dot(val,val));\n' +
            '  float alpha = 1.0;\n' +
            '  if (dist > R) {\n' +
            '    discard;\n' +
            '  }\n' +
            '  gl_FragColor = vec4(100.0, 0.0, dist, alpha);\n' +  // Set the color   
            '}\n';
        this.shader.init(webGL, vertexShaderSource, fragmentShaderSource)
        var verticesTexCoords = new Float32Array([
            -0.5,  0.5,
            -0.5, -0.5, 
             0.5,  0.5, 
             0.5, -0.5
        ]);
        this.vertexTexCoordBuffer = webGL.createBuffer();
        // BIND THE BUFFER TO BE VERTEX DATA
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);
        // AND SEND THE DATA TO THE BUFFER WE CREATED ON THE GPU
        webGL.bufferData(webGL.ARRAY_BUFFER, verticesTexCoords, webGL.STATIC_DRAW);
        // SETUP THE SHADER ATTRIBUTES AND UNIFORMS
        this.webGLAttributeLocations = {};
        this.webGLUniformLocations = {};
        this.loadAttributeLocations(webGL, ['a_Position', 'a_ValueToInterpolate']);
        this.loadUniformLocations(webGL, ['u_SpriteTransform']);

        // WE'LL USE THESE FOR TRANSOFMRING OBJECTS WHEN WE DRAW THEM
        this.circleTransform = new Matrix(4, 4);
        this.circleTranslate = new Vector3();
        this.circleRotate = new Vector3();
        this.circleScale = new Vector3();
    }

    private loadAttributeLocations(webGL : WebGLRenderingContext, attributeLocationNames : Array<string>) {
        for (var i = 0; i < attributeLocationNames.length; i++) {
            let locationName : string = attributeLocationNames[i];
            let location : GLuint = webGL.getAttribLocation(this.shader.getProgram(), locationName);
            this.webGLAttributeLocations[locationName] = location;
        }
    }

    private loadUniformLocations(webGL : WebGLRenderingContext, uniformLocationNames : Array<string>) {
        for (let i : number = 0; i < uniformLocationNames.length; i++) {
            let locationName : string = uniformLocationNames[i];
            let location : WebGLUniformLocation = webGL.getUniformLocation(this.shader.getProgram(), locationName);
            this.webGLUniformLocations[locationName] = location;
        }
    }

    public renderCircleObjects(  webGL : WebGLRenderingContext, 
        canvasWidth : number, 
        canvasHeight : number, 
        visibleSet : Array<CircleObject>) : void {
        // SELECT THE ANIMATED SPRITE RENDERING SHADER PROGRAM FOR USE
        let shaderProgramToUse = this.shader.getProgram();
        webGL.useProgram(shaderProgramToUse);

        // AND THEN RENDER EACH ONE
        for (let sprite of visibleSet) {
            this.renderCircleObject(webGL, canvasWidth, canvasHeight, sprite);        
        }
    }

    public renderCircleObject(webGL : WebGLRenderingContext, 
        canvasWidth : number, 
        canvasHeight : number, 
        circle : CircleObject) {

        // CALCULATE HOW MUCH TO TRANSLATE THE QUAD PER THE SPRITE POSITION
        let circleWidth : number = circle.getWidth();
        let circleHeight : number = circle.getHeight();
        let circleXInPixels : number = circle.getPosition().getX() + (circleWidth/2);
        let circleYInPixels : number = circle.getPosition().getY() + (circleHeight/2);
        let circleXTranslate : number = (circleXInPixels - (canvasWidth/2))/(canvasWidth/2);
        let circleYTranslate : number = (circleYInPixels - (canvasHeight/2))/(canvasHeight/2);
        this.circleTranslate.setX(circleXTranslate);
        this.circleTranslate.setY(-circleYTranslate);

        // CALCULATE HOW MUCH TO SCALE THE QUAD PER THE SPRITE SIZE
        let defaultWidth : number = canvasWidth/2;
        let defaultHeight : number = canvasHeight/2;
        let scaleX : number = circleWidth/defaultWidth;
        let scaleY : number = circleHeight/defaultHeight;
        this.circleScale.setX(scaleX);
        this.circleScale.setY(scaleY);

        // @todo - COMBINE THIS WITH THE ROTATE AND SCALE VALUES FROM THE SPRITE
        MathUtilities.identity(this.circleTransform);
        MathUtilities.model(this.circleTransform, this.circleTranslate, this.circleRotate, this.circleScale);
   

        // USE THE ATTRIBUTES
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vertexTexCoordBuffer);;

        // HOOK UP THE ATTRIBUTES
        let a_PositionLocation : GLuint = this.webGLAttributeLocations['a_Position'];
        webGL.vertexAttribPointer(a_PositionLocation, 2, webGL.FLOAT, false, 0, 0);
        webGL.enableVertexAttribArray(a_PositionLocation);
        let a_ValueToInterpolateLocation : GLuint = this.webGLAttributeLocations['a_ValueToInterpolate'];
        webGL.vertexAttribPointer(a_ValueToInterpolateLocation, 2, webGL.FLOAT, false, 0, 0);
        webGL.enableVertexAttribArray(a_ValueToInterpolateLocation);

        // USE THE UNIFORMS
        let u_SpriteTransformLocation : WebGLUniformLocation = this.webGLUniformLocations['u_SpriteTransform'];
        webGL.uniformMatrix4fv(u_SpriteTransformLocation, false, this.circleTransform.getData());
    
        // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
        webGL.drawArrays(webGL.TRIANGLE_STRIP, SpriteDefaults.INDEX_OF_FIRST_VERTEX, SpriteDefaults.NUM_VERTICES);
    }
}