/* eslint-disable require-yield, eqeqeq */

import {
  Stage as StageBase,
  Trigger,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Stage extends StageBase {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Nothing", "./Stage/costumes/Nothing.svg", { x: 240, y: 180 })
    ];

    this.sounds = [
      new Sound(
        "Elektronomia - Energy NCS Release",
        "./Stage/sounds/Elektronomia - Energy NCS Release.wav"
      )
    ];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked)
    ];

    this.vars.cameraX = 690;
    this.vars.cameraY = 162.00000000000006;
    this.vars.playerX = 689.9999999999998;
    this.vars.playerY = 162;
    this.vars.sx = -1.6644912828857374e-22;
    this.vars.sy = 0;
    this.vars.jumping = 0;
    this.vars.touching = 0;
    this.vars.collisionCounter = 60;
    this.vars.fade = 0;
    this.vars.colSave = 25;
    this.vars.level = 2;
    this.vars.mouseX = 450;
    this.vars.mouseY = 342.00000000000006;
    this.vars.y = 16;
    this.vars.upDown = 1;
    this.vars.collisionList = [
      1,
      500,
      100,
      550,
      100,
      1,
      500,
      50,
      550,
      50,
      1,
      500,
      50,
      500,
      100,
      1,
      550,
      50,
      550,
      100,
      1,
      650,
      150,
      700,
      150,
      1,
      650,
      100,
      700,
      100,
      1,
      650,
      100,
      650,
      150,
      1,
      700,
      100,
      700,
      150,
      1,
      850,
      100,
      850,
      150,
      1,
      800,
      100,
      850,
      100,
      1,
      800,
      100,
      800,
      150,
      3,
      800,
      150,
      850,
      150
    ];
    this.vars.spawnpoints = [70, 50, 0, 0];
  }

  *whenGreenFlagClicked() {
    while (true) {
      yield* this.playSoundUntilDone("Elektronomia - Energy NCS Release");
      yield;
    }
  }
}
