import * as mc from "@minecraft/server";
mc.world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
	if (event.itemStack?.typeId == "minecraft:stick" && event.player.isSneaking) {
		mc.system.run(() => {
			event.player.inputPermissions.setPermissionCategory(4, !event.player.inputPermissions.isPermissionCategoryEnabled(4));
			event.player.inputPermissions.setPermissionCategory(6, !event.player.inputPermissions.isPermissionCategoryEnabled(6));
			
		});
	}
});

mc.system.runInterval(()=>{
	for(let player of mc.world.getPlayers()){
		mc.world.sendMessage(`${JSON.stringify(player.getRotation())}`);
	}
}, 20);