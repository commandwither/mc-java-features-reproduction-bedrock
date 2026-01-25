"use strict"
export class Vector {
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  };
  static add(vec1, vec2){
    return {x: vec1.x + vec2.x, y: vec1.y + vec2.y, z: vec1.z + vec2.z};
  };
  static substract(vec1, vec2){
    return {x: vec1.x - vec2.x, y: vec1.y - vec2.y, z: vec1.z - vec2.z};
  };
  static faceLocation(theVector, theDistance, theRotation) {
    let faceVector_y = (theVector.y - Math.sin(theRotation.x * Math.PI / 180) * theDistance);
    let faceVector_r = (Math.cos(theRotation.x * Math.PI / 180) * theDistance);
    let faceVector_x = (theVector.x - faceVector_r * Math.sin(theRotation.y * Math.PI / 180));
    let faceVector_z = (theVector.z + faceVector_r * Math.cos(theRotation.y * Math.PI / 180));
    let finallyVector = {
      x: faceVector_x,
      y: faceVector_y,
      z: faceVector_z
    };
    return finallyVector;
  };
}