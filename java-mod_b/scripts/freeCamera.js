import * as mc from "@minecraft/server";

export class FreeCamera {
	#player;
	#rotation;
	#initialRotation;
	#position;
	#thread;
	constructor(player){
		this.#player = player;
		this.#player.freeCamera = true;
		this.#rotation = { x: player.getRotation().x, y: player.getRotation().y};
		this.#initialRotation = { x: player.getRotation().x, y: player.getRotation().y };
		this.#position = {x: player.location.x, y: player.location.y, z: player.location.z};
		this.#thread = mc.system.runInterval(()=>{
			if(this.#player.freeCamera === undefined){
				this.#close();
				return;
			};
			let playerXYMovement = this.#player.inputInfo.getMovementVector();
			let verticalMovement = 0;
			if(this.#player.inputInfo.getButtonState("Jump") === "Pressed"){
				verticalMovement++;
			};
			if(player.isSneaking){
			 	verticalMovement--;
			};
			this.#position.y += verticalMovement * 0.5;
			let playerRotation = this.#player.getRotation();
			this.#rotation.x += (playerRotation.x - this.#initialRotation.x);
			//范围检测
			if(this.#rotation.x > 90){
				this.#rotation.x = 90;
			};
			if(this.#rotation.x < -90){
				this.#rotation.x = -90;
			}
			this.#rotation.y += (playerRotation.y - this.#initialRotation.y);
			this.#position.x += playerXYMovement.x * Math.cos(this.#rotation.y * 3.1415 / 180) - playerXYMovement.y * Math.sin(this.#rotation.y * 3.1415 / 180);
			this.#position.z += playerXYMovement.y * Math.cos(this.#rotation.y * 3.1415 / 180) + playerXYMovement.x * Math.sin(this.#rotation.y * 3.1415 / 180);
			player.camera.setCamera("usf:example_player_effects", {
        location: this.#position,
        rotation: this.#rotation,
        easeOptions: {
          easeTime: 0.1
        }
      });
      this.#player.setRotation(this.#initialRotation);
      this.#player.onScreenDisplay.setActionBar(`相机坐标：${this.#position.x} ${this.#position.y} ${this.#position.z}\n${this.#initialRotation.y}, ${playerRotation.y}`);
		}, 0);
		mc.system.run(()=>{
			this.#player.inputPermissions.setPermissionCategory(4, false);
			this.#player.inputPermissions.setPermissionCategory(6, false);
		});
	};
	#close(){
		mc.system.run(()=>{
			this.#player.inputPermissions.setPermissionCategory(4, true);
			this.#player.inputPermissions.setPermissionCategory(6, true);
			this.#player.camera.clear();
			mc.system.clearRun(this.#thread);
		});
	};
}