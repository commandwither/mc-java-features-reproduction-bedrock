import * as mc from "@minecraft/server"
import {
  Vector
} from "./api/vector.js"
const Direction = ["down", "up", "south", "north", "east", "west"];
const BlockType = [
  "minecraft:tnt",
  "minecraft:rail",
  "minecraft:activator_rail",
  "minecraft:detector_rail",
  "minecraft:golden_rail"
];
const DirectionOffset = [{
  x: 0,
  y: -1,
  z: 0
}, {
  x: 0,
  y: 1,
  z: 0
}, {
  x: 0,
  y: 0,
  z: 1
}, {
  x: 0,
  y: 0,
  z: -1
}, {
  x: 1,
  y: 0,
  z: 0
}, {
  x: -1,
  y: 0,
  z: 0
}];

mc.world.afterEvents.pistonActivate.subscribe((event) => {
  let blockList = Array.from(event.piston.getAttachedBlocks());
  let pistonBlock = event.block;
  let pDirectionOffset = DirectionOffset[pistonBlock.permutation.getState("facing_direction")];
  let blockOffset = event.isExpanding ? pDirectionOffset : Vector.substract({
    x: 0,
    y: 0,
    z: 0
  }, pDirectionOffset);
  mc.system.runTimeout(() => {
    for (let blockPosition of blockList) {
      const block = pistonBlock.dimension.getBlock(Vector.add(blockPosition, blockOffset));
      if (BlockType.includes(block.typeId) && block.getRedstonePower()) {
        const blockCopy = {...block, typeId: block.typeId};
        if(block.dimension.getBlock(blockCopy).typeId !== "minecraft:air"){
          mc.system.runTimeout(()=>{pistonBlock.dimension.runCommand(`setblock ${blockCopy.x} ${blockCopy.y} ${blockCopy.z} ${blockCopy.typeId}`)}, 1);
        }
      }
    }
  }, 2);
  
});