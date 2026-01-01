"use strict"
export class Vector {
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static add(vec1, vec2){
    return {x: vec1.x + vec2.x, y: vec1.y + vec2.y, z: vec1.z + vec2.z};
  }
  static substract(vec1, vec2){
    return {x: vec1.x - vec2.x, y: vec1.y - vec2.y, z: vec1.z - vec2.z};
  }
}