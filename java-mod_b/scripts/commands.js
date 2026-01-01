"use strict"
import * as mc from "@minecraft/server";
import { FreeCamera } from "./freeCamera.js";
mc.system.beforeEvents.startup.subscribe((event)=>{
	event.customCommandRegistry.registerCommand({
		cheatsRequired: false,
		description: "自由视角",
		permissionLevel: 0,
		name: "wes:fc"
	}, (source, ...args)=>{
		if(source.sourceType !== "Entity" && source.sourceEntity.typeId !== "minecraft:player"){
			return {
				message: "发送者非玩家",
				status: 1
			};
		};
		if(source.sourceEntity.freeCamera === undefined){
			new FreeCamera(source.sourceEntity);
		} else {
			source.sourceEntity.freeCamera = undefined;
		}
	});
});