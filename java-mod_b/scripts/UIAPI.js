import {
  ActionFormData,
  ActionFormResponse,
  MessageFormData,
  MessageFormResponse,
  ModalFormData,
  ModalFormResponse
}
from "@minecraft/server-ui";
import * as mc from "@minecraft/server"

class ScriptActionFormData {
  constructor() {
    this.buttonContainer = [];
    this.Divider = false;
    return this;
  };
  setFather(UI) {
    this.father = UI;
  };
  setTitle(title) {
    this.title = title;
  };
  setInformation(info) {
    this.info = info;
  };
  setDivider(bool) {
    this.Divider = bool;
  }
  /**
    button: {
      buttonDef: {
        text: string,
        iconPath: string
      },
      condition: function(player),
      event: (player)=>{
        …
      }
    }
  */
  addButton(button) {
    this.buttonContainer.push(button);
  };

  removeButton(index) {
    this.buttonContainer.splice(index, 1);
  };

  getButton(index) {
    return this.buttonContainer[index];
  };

  getButtonsArray() {
    return this.buttonContainer;
  };
  setBeforeSendEvents(events) {
    this.beforeEvents = events;
  };
  setButtonsArray(buttonArray) {
    this.buttonContainer = buttonArray;
    return 0;
  };

  sendToPlayer(player) {
    if (this.beforeEvents !== undefined) {
      this.beforeEvents(player, this);
    };
    if (player.typeId === "minecraft:player") {
      let ui = new ActionFormData();
      let buttonEvents = [];
      ui.title(this.title);
      if (this.info !== undefined) ui.body(this.info);
      if (this.Divider) {
        ui = ui.divider();
      };
      for (let index = 0; index < this.buttonContainer.length; index++) {
        if (this.buttonContainer[index].condition === undefined || this.buttonContainer[index].condition(player) === true) {
          ui.button(this.buttonContainer[index].buttonDef.text, this.buttonContainer[index].buttonDef.iconPath);
          buttonEvents.push(this.buttonContainer[index].event);
        }
      };
      ui.show(player).then((result) => {
        if (result.canceled) {
          if (result.cancelationReason === "UserBusy") {
            mc.system.runTimeout(() => {
              this.sendToPlayer(player);
            }, 10);
            return;
          };
          if (result.cancelationReason === "UserClosed") {
            if (this.father !== undefined) {
              this.father.sendToPlayer(player);
            }
          }
        } else {
          buttonEvents[result.selection](player, result.selection);
        }
      })
    }
  }
};

class ScriptMessageFormData {
  constructor() {
    this.events = [(player)=>{}, (player)=>{}];
    return this;
  };
  setButton(id, text, events = undefined){
    if (id === 1) {
      this.button1 = text;
      if(events !== undefined){
        this.events[0] = events;
      }
    };
    if (id === 2) {
      this.button2 = text;
      if(events !== undefined){
        this.events[1] = events;
      }
    }
  };
  setFather(UI) {
    this.father = UI;
  };
  setTitle(title) {
    this.title = title;
  };
  setInformation(info) {
    this.info = info;
  };
  setBeforeSendEvents(events) {
    this.beforeEvents = events;
  };

  sendToPlayer(player) {
    if (this.beforeEvents !== undefined) {
      this.beforeEvents(player, this);
    };
    if (player.typeId === "minecraft:player") {
      let ui = new MessageFormData();
      ui.title(this.title);
      ui.body(this.info);
      if (this.button1 !== undefined) ui.button1(this.button1);
      if (this.button2 !== undefined) ui.button2(this.button2);
      ui.show(player).then((result) => {
        if (result.canceled) {
          if (result.cancelationReason === "UserBusy") {
            mc.system.runTimeout(() => {
              this.sendToPlayer(player);
            }, 10);
            return;
          };
          if (result.cancelationReason === "UserClosed") {
            if (this.father !== undefined) {
              this.father.sendToPlayer(player);
            }
          }
        } else {
          this.events[result.selection](player);
        }
      })
    }
  }
}

class ScriptModalFormData {
  constructor() {
    this.buttonContainer = [];
    return this;
  };
  setFather(UI) {
    this.father = UI;
  };
  setTitle(title) {
    this.title = title;
  };
  setInformation(info) {
    this.info = info;
  };
  setHeader(header) {
    this.header = header;
  };
  setEvents(events) {
    this.events = events;
  };
  setBeforeSendEvents(events) {
    this.beforeEvents = events;
  };
  /*
    widget: {
      typeId: "dropdown", "toggle", "slider", "textField",
      setting: setting,
      condition: function(player)
    }
    
    setting: "dropdown": {label: <string>, items: string[], defaultValue: number }
            "toggle": {label: <string>, defalutValue: bool}
            "slider": {label: <string>, minValue: <number>, maxValue: <number>, defaultValue: <number>, step: <number> }
            "textField": {label: <string>, placeHolderText: <string>, defaultValue: <string>}
    
    let mui = new ModalFormData();
    mui.title("这是title");
    mui.header("这是header");
    mui.label("这是label");
    mui.submitButton("这是submit");
    mui.toggle("toggle");
    mui.dropdown("dropdown", ["1", "2", "3"]);
    mui.textField("textField", "backText");
    mui.slider("slider", 3, 13 );
    mui = mui.divider();
    mui.show(player);
  */
  addButton(button) {
    this.buttonContainer.push(button);
  };

  removeButton(index) {
    this.buttonContainer.splice(index, 1);
  };

  getButton(index) {
    return this.buttonContainer[index];
  };

  getButtonsArray() {
    return this.buttonContainer;
  };

  setButtonsArray(buttonArray) {
    if (Array.isArray(buttonArray)) {
      this.buttonContainer = buttonArray;
      return 0;
    };
    return 1;
  };

  sendToPlayer(player) {
    if (this.beforeEvents !== undefined) {
      this.beforeEvents(player, this);
    };
    if (player.typeId === "minecraft:player") {
      let ui = new ModalFormData();
      let buttonResults = [];
      ui.title(this.title);
      if (this.info !== undefined) ui.label(this.info);
      if (this.header !== undefined) ui.header(this.header);
      if (this.Divider) {
        ui = ui.divider();
      };
      for (let index = 0; index < this.buttonContainer.length; index++) {
        if (this.buttonContainer[index].condition === undefined || this.buttonContainer[index].condition(player) === true) {
          switch (this.buttonContainer[index].typeId) {
            case "dropdown":
              ui.dropdown(
                this.buttonContainer[index].setting.label,
                this.buttonContainer[index].setting.items, {
                  defaultValueIndex: (this.buttonContainer[index].setting.defaultValue === undefined ? 0 : this.buttonContainer[index].setting.defaultValue)
                }
              );
              break;
            case "toggle":
              ui.toggle(this.buttonContainer[index].setting.label, {
                defaultValue: (this.buttonContainer[index].setting.defaultValue === undefined ? false : this.buttonContainer[index].setting.defaultValue)
              });
              break;
            case "slider":
              ui.slider(this.buttonContainer[index].setting.label, this.buttonContainer[index].setting.minValue, this.buttonContainer[index].setting.maxValue, {
                defaultValue: (this.buttonContainer[index].setting.defaultValue === undefined ? 0 : this.buttonContainer[index].setting.defaultValue),
                valueStep: (this.buttonContainer[index].setting.step === undefined ? 1 : this.buttonContainer[index].setting.step)
              });
              break;
            case "textField":
              ui.textField(this.buttonContainer[index].setting.label, (this.buttonContainer[index].setting.placeHolderText === undefined ? "" : this.buttonContainer[index].setting.placeHolderText), {
                defaultValue: (this.buttonContainer[index].setting.defaultValue === undefined ? "" : this.buttonContainer[index].setting.defaultValue)
              });
              break;
          }
          buttonResults.push({
            nameSpace: this.buttonContainer[index].setting.label,
            result: undefined
          });
        }
      };
      ui.show(player).then((result) => {
        if (result.canceled) {
          if (result.cancelationReason === "UserBusy") {
            mc.system.runTimeout(() => {
              this.sendToPlayer(player);
            }, 10);
            return;
          };
          if (result.cancelationReason === "UserClosed") {
            if (this.father !== undefined) {
              this.father.sendToPlayer(player);
            }
          }
        } else {
          for (let index = 0; index < buttonResults.length; index++) {
            buttonResults[index].result = result.formValues[index];
          };
          this.events(player, buttonResults);
        }
      })
    }
  }
}


export class ScriptUI {
  static ActionFormData = ScriptActionFormData;
  static ModalFormData = ScriptModalFormData;
  static MessageFormData = ScriptMessageFormData;
}