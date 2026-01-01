"use strict"
import * as mc from "@minecraft/server";
mc.world.afterEvents.playerSpawn.subscribe((events) => {
  events.player.addEffect("resistance", 60, {
    amplifier: 128,
    showParticles: false
  })
})