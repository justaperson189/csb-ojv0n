/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Sprite1 extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Sprite1/costumes/costume1.svg", {
        x: 0,
        y: 0
      }),
      new Costume(
        "justsomepenplatormer",
        "./Sprite1/costumes/justsomepenplatormer.svg",
        { x: 240, y: 180 }
      ),
      new Costume(
        "Crystal LogoNorm",
        "./Sprite1/costumes/Crystal LogoNorm.png",
        { x: 360, y: 360 }
      ),
      new Costume("Vector Logo (1)", "./Sprite1/costumes/Vector Logo (1).svg", {
        x: 90.75,
        y: 90.75
      })
    ];

    this.sounds = [new Sound("pop", "./Sprite1/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked)
    ];
  }

  *whenGreenFlagClicked() {
    this.visible = false;
  }
}
