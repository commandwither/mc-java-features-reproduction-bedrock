import * as mc from "@minecraft/server";

function vectorDistance(Vector1, Vector2) {
  let TheDistance = Math.sqrt(Math.pow((Vector1.x - Vector2.x), 2) + Math.pow((Vector1.y - Vector2.y), 2) + Math.pow((Vector1.z - Vector2.z), 2));
  return TheDistance;
};

function faceLocation(theVector, theDistance, theRotation) {
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

mc.system.runInterval(() => {
  for (let player of mc.world.getAllPlayers()) {
    if (player.getDynamicProperty("vision") === true) {
      if (player.getVelocity().x !== 0 || player.getVelocity().y !== 0 || player.getVelocity().z !== 0) {
        let playerLoc = player.getDynamicProperty("location");
        //playerLoc.y++;
        playerLoc.x += 0.5;
        playerLoc.z += 0.5;
        player.teleport(playerLoc);
        player.setDynamicProperty("cameraPosition", faceLocation(player.getDynamicProperty("cameraPosition"), 0.8, player.getRotation()));
      };
      let cameraLoc = player.getDynamicProperty("cameraPosition");
      player.camera.setCamera("usf:example_player_effects", {
        location: cameraLoc,
        rotation: player.getRotation(),
        easeOptions: {
          easeTime: 0.1
        }
      });
      player.onScreenDisplay.setActionBar(`相机坐标：${cameraLoc.x} ${cameraLoc.y} ${cameraLoc.z}`);
    } else {
      player.camera.clear();
    }
  }
});

mc.world.beforeEvents.playerInteractWithBlock.subscribe((event)=>{
  if(event.itemStack?.typeId == "minecraft:stick" && event.player.isSneaking){
    event.cancel = true;
    mc.system.run(()=>{
      event.player.setDynamicProperty("vision", event.player.getDynamicProperty("vision") === undefined ? true : event.player.getDynamicProperty("vision") === true ? false : true);
      event.player.setDynamicProperty("cameraPosition", event.player.location);
      event.player.setDynamicProperty("location", event.player.dimension.getBlock(event.player.location));
    });
  }
});