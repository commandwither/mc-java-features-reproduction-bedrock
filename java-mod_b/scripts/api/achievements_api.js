import * as mc from "@minecraft/server";

var achievements_die = [];
var achievements_list = [];

function addAchievement(type, callback){
  if(type === "die"){
    achievements_die.push(callback);
  }
};
function defAch (type, name, parent, trigger, event) {
  this.type = type;
  this.name = name;
  this.parent = parent;
  this.trigger = trigger;
  this.event = event;
}


mc.world.afterEvents.entityDie.subscribe(()=>{
  
})