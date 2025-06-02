//by 凋空凌
import * as mc from "@minecraft/server";
export {enchantment_api};
var enchantment_api = {
  define_enchantment: function(enc_name, maxLevel, toolsCanUse) {
    return new enc(enc_name, maxLevel, toolsCanUse);
  },
  addEnchantment: function(enchantment) {
    def_enc.addEnc(enchantment);
  },
  itemCanUse: function(item) {
    let can_enc_list;
    if (item.typeId.indexOf("sword") !== -1) {
      return def_enc.sword;
    } else if (item.typeId.indexOf("pick_axe") !== -1) {
      return def_enc.pickaxe;
    } else if (item.typeId.indexOf("axe") !== -1) {
      return def_enc.axe;
    } else if (item.typeId.indexOf("bow") !== -1) {
      return def_enc.bow;
    } else if (item.typeId.indexOf("shovel") !== -1) {
      return def_enc.shovel;
    } else if (item.typeId.indexOf("hoe") !== -1) {
      return def_enc.hoe;
    } else if (item.typeId.indexOf("shield") !== -1) {
      return def_enc.shield;
    } else if (item.typeId.indexOf("helmet") !== -1) {
      return def_enc.helmet;
    } else if (item.typeId.indexOf("chestplate") !== -1) {
      return def_enc.chestplate;
    } else if (item.typeId.indexOf("leggings") !== -1) {
      return def_enc.leggings;
    } else if (item.typeId.indexOf("boots") !== -1) {
      return def_enc.boots;
    };
    if (item.typeId === "minecraft:enchanted_book") {
      return def_enc.allEnc;
    }
  },
  itemAddEnchantment: function(item, enc, level) {
    //world.sendMessage("start");
    for (let num = 0; num < item ? .getLore()
      .length; num++) {
      if (item.getLore()[num].indexOf(enc.name) !== -1) {
        let loreLevel = Number(item ? .getLore()[num] ? .slice(enc.name.length + 4));
        if (enc.maxlevel > loreLevel && item.typeId !== "minecraft:enchanted_book") {
          if (loreLevel < level) {
            let relo = item.getLore();
            relo[num] = `§r${enc.name}: ${level}`;
            item.setLore(relo);
            return item;
          } else if (loreLevel === level) {
            let relo = item.getLore();
            relo[num] = `§r${enc.name}: ${level + 1}`;
            item.setLore(relo);
            return item;
          } else {
            return false;
          }
        } else if (item.typeId === "minecraft:enchanted_book" && enc.maxlevel > loreLevel && loreLevel === level) {
          let relo = item.getLore();
          relo[num] = `§r${enc.name}: ${loreLevel + 1}`;
          item.setLore(relo);
          //world.sendMessage("1");
          return item;
        } else {
          //world.sendMessage("2");
          return false;
        }
      }
    };
    let lor = item.getLore();
    lor.push(`§r${enc.name}: ${level}`);
    item.setLore(lor);
    //world.sendMessage("3");
    return item;
  },
  itemEncLevel: function(item, enc, level) {
    for (let num = 0; num < item.getLore() ? .length; num++) {
      if (item.getLore()[num].indexOf(ench.name) !== -1) {
        let loreLevel = Number(item ? .getLore()[num] ? .slice(ench.name.length + 4));
        if (loreLevel >= ench.maxlevel) {
          return null;
        };
        let lores = item.getLore();
        lores[num] = `§r${ench.name}: ${loreLevel + 1}`;
        item.setLore(lores);
        Player.getComponent("minecraft:equippable")
          .setEquipment("Mainhand", item);
        return 0;
      }
    }
  },
  itemGetEnchantment: function(item) {
    let enchantments = [];
    for (let num = 0; num < item.getLore() ? .length; num++) {
      for (let ench of def_enc.allEnc) {
        if (item.getLore()[num].indexOf(ench.name) !== -1) {
          let level = Number(item ? .getLore()[num] ? .slice(ench.name.length + 4));
          enchantments.push({
            enchantment: ench,
            level: level
          });
        }
      }
    }
    return enchantments;
  },
  itemRemoveEnchantment: function(item, enc) {
    for (let num = 0; num < item.getLore() ? .length; num++) {
      if (item.getLore()[num].indexOf(ench.name) !== -1) {
        let lores = item.getLore();
        lores.splice(num, 1);
        item.setLore(lores);
        return 0;
      }
    }
    return 1;
  },
  getEnchantment(typeId) {
    for (let enc of def_enc.allEnc) {
      if (enc.name === typeId) {
        return enc;
      }
    }
    return undefined;
  }
};

var def_enc = new enc_List();

function enc(name, maxlevel, toolCanUses) {
  this.name = name;
  this.maxlevel = maxlevel;
  this.minlevel = 0;
  this.effects = [];
  this.trigger = {
    tick: undefined,
    attacker: undefined,
    victim: undefined,
    isOnlyMainhand: true
  };
  this.toolCanUses = toolCanUses;
  this.setTrigger = function(type, event) {
    if (type === "tick") {
      this.trigger.tick = event;
    };
    if (type === "attacker") {
      this.trigger.attacker = event;
    };
    if (type === "victim") {
      this.trigger.victim = event;
    }
    return this;
  }
  this.setHand = function(bool) {
    this.trigger.isOnlyMainhand = bool;
    return this;
  }
};

//by 指令凋灵
function enc_List() {
  //weapons
  this.sword = [];
  this.axe = [];
  this.pickaxe = [];
  this.hoe = [];
  this.shovel = [];
  this.bow = [];
  this.shield = [];
  //armor
  this.helmet = [];
  this.chestplate = [];
  this.leggings = [];
  this.boots = [];
  //event_group
  this.custom_group = [];
  this.allEnc = [];
  this.enc_hurtAttacker = [];
  this.enc_hurtVictim = [];
  //this.enc_dropDamage = [];
  //this.enc_voidDamage = [];
  this.enc_tick = [];
  this.addEnc = function(enc) {
    this.allEnc.push(enc);
    if (enc.trigger.attacker !== undefined) {
      this.enc_hurtAttacker.push(enc);
    };
    if (enc.trigger.victim !== undefined) {
      this.enc_hurtVictim.push(enc);
    };
    if (enc.trigger.tick !== undefined) {
      this.enc_tick.push(enc);
    }
    if (enc.toolCanUses.indexOf("sword") !== -1) {
      this.sword.push(enc);
    };
    if (enc.toolCanUses.indexOf("pick_axe") !== -1) {
      this.pickaxe.push(enc);
    } else if (enc.toolCanUses.indexOf("axe") !== -1) {
      this.axe.push(enc);
    };
    if (enc.toolCanUses.indexOf("hoe") !== -1) {
      this.hoe.push(enc);
    };
    if (enc.toolCanUses.indexOf("shovel") !== -1) {
      this.shovel.push(enc);
    };
    if (enc.toolCanUses.indexOf("bow") !== -1) {
      this.bow.push(enc);
    };
    if (enc.toolCanUses.indexOf("shield") !== -1) {
      this.shield.push(enc);
    };
    if (enc.toolCanUses.indexOf("helmet") !== -1) {
      this.helmet.push(enc);
    };
    if (enc.toolCanUses.indexOf("chestplate") !== -1) {
      this.chestplate.push(enc);
    };
    if (enc.toolCanUses.indexOf("leggings") !== -1) {
      this.leggings.push(enc);
    };
    if (enc.toolCanUses.indexOf("boots") !== -1) {
      this.boots.push(enc);
    };
    if (enc.toolCanUses.indexOf("custom_group") === 0) {
      this.custom_group.push(enc);
    }
  }
};

system.runInterval(() => {
  for (let player of mc.world.getAllPlayers()) {
    for (let ench of def_enc.enc_tick) {
      if (player.getComponent("minecraft:equippable")
        .getEquipment("Mainhand") !== undefined) {
        for (let Lore of player.getComponent("minecraft:equippable")
          .getEquipment("Mainhand")
          .getLore()) {
          if (Lore.indexOf(ench.name) !== -1) {
            let level = Number(Lore ? .slice(ench.name.length + 4));
            ench.trigger.tick(player, level);
          }
        }
      };
      if (player.getComponent("minecraft:equippable")
        .getEquipment("Offhand") !== undefined) {
        for (let Lore of player.getComponent("minecraft:equippable")
          .getEquipment("Offhand")
          .getLore()) {
          if (Lore.indexOf(ench.name) !== -1 && ench.trigger.isOnlyMainhand === false) {
            let level = Number(Lore ? .slice(ench.name.length + 4));
            ench.trigger.tick(player, level);
          }
        }
      };
      if (player.getComponent("minecraft:equippable")
        .getEquipment("Head") !== undefined) {
        for (let Lore of player.getComponent("minecraft:equippable")
          .getEquipment("Head")
          .getLore()) {
          if (Lore.indexOf(ench.name) !== -1) {
            let level = Number(Lore ? .slice(ench.name.length + 4));
            ench.trigger.tick(player, level);
          }
        }
      };
      if (player.getComponent("minecraft:equippable")
        .getEquipment("Chest") !== undefined) {
        for (let Lore of player.getComponent("minecraft:equippable")
          .getEquipment("Chest")
          .getLore()) {
          if (Lore.indexOf(ench.name) !== -1) {
            let level = Number(Lore ? .slice(ench.name.length + 4));
            ench.trigger.tick(player, level);
          }
        }
      };
      if (player.getComponent("minecraft:equippable")
        .getEquipment("Legs") !== undefined) {
        for (let Lore of player.getComponent("minecraft:equippable")
          .getEquipment("Legs")
          .getLore()) {
          if (Lore.indexOf(ench.name) !== -1) {
            let level = Number(Lore ? .slice(ench.name.length + 4));
            ench.trigger.tick(player, level);
          }
        }
      };
      if (player.getComponent("minecraft:equippable")
        .getEquipment("Feet") !== undefined) {
        for (let Lore of player.getComponent("minecraft:equippable")
          .getEquipment("Feet")
          .getLore()) {
          if (Lore.indexOf(ench.name) !== -1) {
            let level = Number(Lore ? .slice(ench.name.length + 4));
            ench.trigger.tick(player, level);
          }
        }
      }
    }
  }
}, 1);

mc.world.afterEvents.entityHurt.subscribe((eH) => {
  //world.sendMessage(`${eH.hurtEntity.getComponent("minecraft:health").currentValue}/${eH.hurtEntity.getComponent("minecraft:health").defaultValue}`);
  let attacker_Main_lores = [];
  let victim_Main_lores = [];
  let attacker_Off_lores = [];
  let victim_Off_lores = [];
  if (eH.damageSource ? .damagingEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Mainhand") !== undefined && eH.damageSource.damagingEntity.getComponent("minecraft:equippable") ? .getEquipment("Mainhand")
    .getLore !== undefined) {
    attacker_Main_lores = eH.damageSource.damagingEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Mainhand") ? .getLore();
  };
  if (eH.damageSource ? .damagingEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Offhand") !== undefined && eH.damageSource.damagingEntity.getComponent("minecraft:equippable") ? .getEquipment("Offhand")
    .getLore !== undefined) {
    attacker_Off_lores = eH.damageSource.damagingEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Offhand") ? .getLore();
  };
  if (eH.hurtEntity.getComponent("minecraft:equippable") ? .getEquipment("Offhand") !== undefined && eH.hurtEntity.getComponent("minecraft:equippable") ? .getEquipment("Offhand")
    .getLore !== undefined) {
    victim_Off_lores = eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Offhand") ? .getLore();
  };
  if (eH.hurtEntity.getComponent("minecraft:equippable") ? .getEquipment("Mainhand") !== undefined && eH.hurtEntity.getComponent("minecraft:equippable") ? .getEquipment("Mainhand")
    .getLore !== undefined) {
    victim_Main_lores = eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Mainhand") ? .getLore();
  };
  for (let lore of attacker_Main_lores) {
    for (let ench of def_enc.enc_hurtAttacker) {
      if (lore.indexOf(ench.name) !== -1) {
        let level = Number(lore ? .slice(ench.name.length + 4));
        ench.trigger.attacker(eH.damage, eH.damageSource, eH.hurtEntity, level);
      }
    }
  };
  for (let lore of attacker_Off_lores) {
    for (let ench of def_enc.enc_hurtAttacker) {
      if (lore.indexOf(ench.name) !== -1 && ench.trigger.isOnlyMainhand === false) {
        let level = Number(lore ? .slice(ench.name.length + 4));
        ench.trigger.attacker(eH.damage, eH.damageSource, eH.hurtEntity, level);
      }
    }
  };
  for (let lore of victim_Main_lores) {
    for (let ench of def_enc.enc_hurtVictim) {
      if (lore.indexOf(ench.name) !== -1 && ench.trigger.isOnlyMainhand) {
        let level = Number(lore ? .slice(ench.name.length + 4));
        ench.trigger.victim(eH.damage, eH.damageSource, eH.hurtEntity, level);
      }
    }
  };
  for (let lore of victim_Off_lores) {
    for (let ench of def_enc.enc_hurtVictim) {
      if (lore.indexOf(ench.name) !== -1 && ench.trigger.isOnlyMainhand === false) {
        let level = Number(lore ? .slice(ench.name.length + 4));
        ench.trigger.victim(eH.damage, eH.damageSource, eH.hurtEntity, level);
      }
    }
  };
  for (let ench of def_enc.enc_hurtVictim) {
    if (eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Head") !== undefined) {
      for (let Lore of eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Head")
        .getLore()) {
        if (Lore.indexOf(ench.name) !== -1) {
          let level = Number(Lore ? .slice(ench.name.length + 4));
          ench.trigger.victim(eH.damage, eH.damageSource, eH.hurtEntity, level);
        }
      }
    };
    if (eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Chest") !== undefined) {
      for (let Lore of eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Chest")
        .getLore()) {
        if (Lore.indexOf(ench.name) !== -1) {
          let level = Number(Lore ? .slice(ench.name.length + 4));
          ench.trigger.victim(eH.damage, eH.damageSource, eH.hurtEntity, level);
        }
      }
    };
    if (eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Legs") !== undefined) {
      for (let Lore of eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Legs")
        .getLore()) {
        if (Lore.indexOf(ench.name) !== -1) {
          let level = Number(Lore ? .slice(ench.name.length + 4));
          ench.trigger.victim(eH.damage, eH.damageSource, eH.hurtEntity, level);
        }
      }
    };
    if (eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Feet") !== undefined) {
      for (let Lore of eH.hurtEntity ? .getComponent("minecraft:equippable") ? .getEquipment("Feet")
        .getLore()) {
        if (Lore.indexOf(ench.name) !== -1) {
          let level = Number(Lore ? .slice(ench.name.length + 4));
          ench.trigger.victim(eH.damage, eH.damageSource, eH.hurtEntity, level);
        }
      }
    }
  }
});