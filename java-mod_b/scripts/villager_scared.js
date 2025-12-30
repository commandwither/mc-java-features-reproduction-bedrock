import * as mc from "@minecraft/server";

const AvoidBlockType = [
	"minecraft:air",
	"minecraft:ice",
	"minecraft:glass",
	"minecraft:bedrock",
	"minecraft:frosted_ice"
];

function inside(pos1, pos2, testLoc){
	let max = {
		x: (pos1.x > pos2.x ? pos1.x : pos2.x),
		y: (pos1.y > pos2.y ? pos1.y : pos2.y),
		z: (pos1.z > pos2.z ? pos1.z : pos2.z)
	};
	let min = {
		x: (pos1.x < pos2.x ? pos1.x : pos2.x),
		y: (pos1.y < pos2.y ? pos1.y : pos2.y),
		z: (pos1.z < pos2.z ? pos1.z : pos2.z)
	}
	if((testLoc.x > min.x) && (testLoc.y > min.y) && (testLoc.z > min.z) && (testLoc.x < max.x) && (testLoc.y < max.y) && (testLoc.z < max.z)){
		return true;
	}
	return false;
}

mc.world.afterEvents.dataDrivenEntityTrigger.subscribe((events) => {
	//mc.world.sendMessage("Event trigger: " + events.eventId);
	if (events.eventId == "minecraft:become_scared") {
		let villagerScaredCount = 0;
		for(let villager of events.entity.dimension.getEntities({
			location: events.entity.location,
			maxDistance: 11,
			propertyOptions: [{
				propertyId: "minecraft:scared",
				value: true
			}]
		})){
			if(villager.dimension.getEntities({
				location: villager.location,
				type: "minecraft:iron_golem",
				maxDistance: 17,
			}).length == 0){
				villagerScaredCount++;
			};
		};
		//mc.world.sendMessage("scared: " + villagerScaredCount);
		if(villagerScaredCount >= 3){
			for(let times = 0; times < 10; times++){
				let location = {
					x: events.entity.location.x + Math.round(Math.random() * 17) - 8,
					z: events.entity.location.z + Math.round(Math.random() * 17) - 8
				};
				let testBlock = events.entity.dimension.getTopmostBlock(location);
				//mc.world.sendMessage(testBlock.typeId);
				if(testBlock && testBlock.typeId && !AvoidBlockType.includes(testBlock.typeId) && inside({x: events.entity.location.x + 8, y: events.entity.location.y + 6, z: events.entity.location.z + 8}, {x: events.entity.location.x - 8, y: events.entity.location.y - 6, z: events.entity.location.z - 8}, testBlock)){
					location.y += 0.2;
					events.entity.dimension.spawnEntity("minecraft:iron_golem", testBlock, {spawnEvent: "minecraft:from_village"});
					break;
				}
			}
		}
	}
}, {
	entityTypes: ["minecraft:villager_v2", "minecraft:villager"]
})