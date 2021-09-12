/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Costume,
  Color,
  Sound
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Main extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Blank", "./Main/costumes/Blank.svg", { x: 249, y: 188.5 })
    ];

    this.sounds = [new Sound("pop", "./Main/sounds/pop.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked)
    ];

    this.vars.idx = 0;
  }

  *whenGreenFlagClicked() {
    this.penSize = 5;
    this.penColor = Color.rgb(0, 0, 0);
    this.stage.vars.level = 1;
    this.stage.vars.playerX = this.stage.vars.spawnpoints[
      this.stage.vars.level * 2 - 1 - 1
    ];
    this.stage.vars.playerY = this.stage.vars.spawnpoints[
      this.stage.vars.level * 2 - 1
    ];
    this.stage.vars.cameraX = this.stage.vars.playerX;
    this.stage.vars.cameraY = this.stage.vars.playerY;
    this.stage.vars.sx = 0;
    this.stage.vars.sy = 0;
    this.stage.vars.jumping = 1;
    this.stage.vars.collisionList = [];
    while (true) {
      this.clearPen();
      this.stage.vars.sy += -1;
      if (
        (this.keyPressed("up arrow") || this.keyPressed("w")) &&
        this.stage.vars.jumping == 0 && this.stage.vars.sy > -2
      ) {
        this.stage.vars.sy = 13;
        this.stage.vars.jumping = 1;
      }
      this.stage.vars.playerY += this.stage.vars.sy;
      yield* this.touchY(0);
      yield* this.dieCheck(!null);
      this.stage.vars.sx +=
        ((this.keyPressed("right arrow") || this.keyPressed("d")) -
          (this.keyPressed("left arrow") || this.keyPressed("a"))) *
        1.5;
      this.stage.vars.sx = this.stage.vars.sx * 0.8;
      this.stage.vars.playerX += this.stage.vars.sx;
      yield* this.touchX(0);
      yield* this.dieCheck(0);
      yield* this.frame(0);
      this.stage.vars.mouseX = this.stage.vars.cameraX + this.mouse.x;
      this.stage.vars.mouseY = this.stage.vars.cameraY + this.mouse.y;
      yield;
    }
  }

  *drawLineFromTo(x, y2, x2, y3, add, type, fade2) {
    yield* this.setColor(type);
    this.penColor.a = 1 - fade2 / 100;
    if (add) {
      if (
        this.stage.vars.playerX - 240 < x2 &&
        this.stage.vars.playerX + 240 > x
      ) {
        if (
          this.stage.vars.playerY - 180 < y3 &&
          this.stage.vars.playerY + 180 > y2
        ) {
          yield* this.add(x, y2, x2, y3, type);
        }
      }
    }
    this.penDown = false;
    this.goto(x - this.stage.vars.cameraX, y2 - this.stage.vars.cameraY);
    this.penDown = true;
    this.goto(x2 - this.stage.vars.cameraX, y3 - this.stage.vars.cameraY);
    this.penDown = false;
  }

  *render() {
    if (this.stage.vars.level == 1) {
      yield* this.level1();
    } else {
      if (this.stage.vars.level == 2) {
        yield* this.level2();
      } else {
        null;
      }
    }
  }

  *player(x3, y4, size, fade3) {
    this.penSize = 5;
    yield* this.drawLineFromTo(
      x3 + size,
      y4 + size,
      x3 + size,
      y4 - size,
      0,
      1,
      fade3
    );
    yield* this.drawLineFromTo(
      x3 - size,
      y4 - size,
      x3 + size,
      y4 - size,
      0,
      1,
      fade3
    );
    yield* this.drawLineFromTo(
      x3 - size,
      y4 + size,
      x3 - size,
      y4 - size,
      0,
      1,
      fade3
    );
    yield* this.drawLineFromTo(
      x3 - size,
      y4 + size,
      x3 + size,
      y4 + size,
      0,
      1,
      fade3
    );
    if (!(size == 0)) {
      yield* this.player(x3, y4, size - 1, fade3);
    }
  }

  *touchY(collidingDangers) {
    yield* this.touching();
    if (this.stage.vars.touching == 3) {
      this.stage.vars.sy = 20;
    }
    if (this.stage.vars.touching == 4) {
      this.stage.vars.level += 1;
    }
    if (
      (this.stage.vars.touching == 1 && !collidingDangers) ||
      (collidingDangers && !(this.stage.vars.touching == 0))
    ) {
      if (!(this.stage.vars.sy > 0)) {
        this.stage.vars.playerY =
          this.stage.vars.collisionList[this.stage.vars.colSave - 0 - 1] + 12;
      } else {
        this.stage.vars.playerY =
          this.stage.vars.collisionList[this.stage.vars.colSave - 2 - 1] + -12;
      }
      if (this.stage.vars.sy < 0) {
        this.stage.vars.jumping = 0;
      }
      this.stage.vars.sy = 0;
      yield* this.touchY(0);
    }
  }

  *touchX(collidingDangers2) {
    yield* this.touching();
    if (
      (this.stage.vars.touching == 1 && !collidingDangers2) ||
      (collidingDangers2 && !(this.stage.vars.touching == 0))
    ) {
      if (this.stage.vars.sx < 0) {
        this.stage.vars.playerX =
          this.stage.vars.collisionList[this.stage.vars.colSave - 1 - 1] + 12;
      } else {
        this.stage.vars.playerX =
          this.stage.vars.collisionList[this.stage.vars.colSave - 3 - 1] + -12;
      }
      this.stage.vars.sx = 0;
      yield* this.touchX(0);
    }
  }

  *touching() {
    this.stage.vars.collisionCounter = 0;
    this.stage.vars.touching = 0;
    while (
      !(
        this.stage.vars.collisionList.length == this.stage.vars.collisionCounter
      )
    ) {
      this.stage.vars.collisionCounter += 5;
      if (
        this.stage.vars.playerX - 12 <
        this.stage.vars.collisionList[
          this.stage.vars.collisionCounter - 1 - 1
        ] -
          0
      ) {
        if (
          this.stage.vars.playerX + 12 >
          this.stage.vars.collisionList[
            this.stage.vars.collisionCounter - 3 - 1
          ] +
            0
        ) {
          if (
            this.stage.vars.playerY - 12 <
            this.stage.vars.collisionList[
              this.stage.vars.collisionCounter - 0 - 1
            ] -
              0
          ) {
            if (
              this.stage.vars.playerY + 12 >
              this.stage.vars.collisionList[
                this.stage.vars.collisionCounter - 2 - 1
              ] +
                0
            ) {
              if (
                this.stage.vars.collisionList[
                  this.stage.vars.collisionCounter - 4 - 1
                ] > this.stage.vars.touching
              ) {
                this.stage.vars.touching = this.stage.vars.collisionList[
                  this.stage.vars.collisionCounter - 4 - 1
                ];
                this.stage.vars.colSave = this.stage.vars.collisionCounter;
              }
            }
          }
        }
      }
    }
  }

  *background() {
    this.penSize = 1000;
    this.penColor = Color.rgb(255, 255, 255);
    this.penDown = false;
    this.goto(0, 0);
    this.penDown = true;
    this.penDown = false;
    this.penColor = Color.rgb(247, 247, 247);
    this.penSize = 3;
    this.goto(-220 - ((this.stage.vars.cameraX / 2) % 40), 180);
    for (let i = 0; i < 13; i++) {
      this.penDown = true;
      this.y += -360;
      this.penDown = false;
      this.y += 360;
      this.x += 40;
    }
    this.goto(-240, 160 + ((this.stage.vars.cameraY / -2) % 40));
    for (let i = 0; i < 10; i++) {
      this.penDown = true;
      this.x += 480;
      this.penDown = false;
      this.x += -480;
      this.y += -40;
    }
  }

  *setCamera(stationary) {
    if (!stationary) {
      this.stage.vars.cameraX +=
        (this.stage.vars.playerX - this.stage.vars.cameraX) / 4;
      this.stage.vars.cameraY +=
        (this.stage.vars.playerY - this.stage.vars.cameraY) / 4;
      if (this.stage.vars.cameraY < 0) {
        this.stage.vars.cameraY = 0;
      }
      if (this.stage.vars.cameraX < 0) {
        this.stage.vars.cameraX = 0;
      }
    }
  }

  *add(x1, y1, x4, y5, type2) {
    this.stage.vars.collisionList.push(type2);
    if (y1 < y5 || x1 < x4) {
      this.stage.vars.collisionList.push(x1 - 0);
      this.stage.vars.collisionList.push(y1);
      this.stage.vars.collisionList.push(x4 + 0);
      this.stage.vars.collisionList.push(y5 + 0);
    } else {
      this.stage.vars.collisionList.push(x4 + 0);
      this.stage.vars.collisionList.push(y5 + 0);
      this.stage.vars.collisionList.push(x1 - 0);
      this.stage.vars.collisionList.push(y1);
    }
  }

  *setColor(type3) {
    if (type3 == 1) {
      this.penColor = Color.rgb(102, 199, 255);
    } else {
      if (type3 == 2) {
        this.penColor = Color.rgb(255, 71, 71);
      } else {
        if (type3 == 3) {
          this.penColor = Color.rgb(255, 221, 71);
        } else {
          this.penColor = Color.rgb(181, 71, 255);
        }
      }
    }
  }

  *respawn(xY) {
    if (xY) {
      yield* this.touchY(!null);
    } else {
      yield* this.touchX(!null);
    }
    this.stage.vars.fade = 0;
    for (let i = 0; i < 10; i++) {
      yield* this.frame(this.stage.vars.fade);
      this.stage.vars.fade += 10;
      yield;
    }
    this.stage.vars.sx = 0;
    this.stage.vars.sy = 0;
    this.stage.vars.jumping = 1;
    for (let i = 0; i < 10; i++) {
      this.stage.vars.playerX +=
        (this.stage.vars.spawnpoints[this.stage.vars.level * 2 - 1 - 1] -
          this.stage.vars.playerX) /
        2;
      this.stage.vars.playerY +=
        (this.stage.vars.spawnpoints[this.stage.vars.level * 2 - 1] -
          this.stage.vars.playerY) /
        2;
      yield* this.frame(this.stage.vars.fade);
      yield;
    }
    this.stage.vars.playerX = this.stage.vars.spawnpoints[
      this.stage.vars.level * 2 - 1 - 1
    ];
    this.stage.vars.playerY = this.stage.vars.spawnpoints[
      this.stage.vars.level * 2 - 1
    ];
    for (let i = 0; i < 4; i++) {
      yield* this.frame(this.stage.vars.fade);
      this.stage.vars.fade += -25;
      yield;
    }
  }

  *frame(fade4) {
    this.stage.vars.collisionList = [];
    yield* this.background();
    yield* this.player(
      Math.floor(this.stage.vars.playerX),
      this.stage.vars.playerY,
      10,
      fade4
    );
    yield* this.render();
    yield* this.setCamera(0);
  }

  *dieCheck(xY2) {
    if (this.stage.vars.touching == 2) {
      if (xY2) {
        yield* this.respawn(!null);
      } else {
        yield* this.respawn(0);
      }
    }
    if (this.stage.vars.playerY < -200) {
      yield* this.respawn(!null);
    }
  }

  *level1() {
    this.penSize = 5;
    yield* this.drawLineFromTo(-100, 0, 100, 0, !null, 1, 0);
    yield* this.drawLineFromTo(-100, -180, -100, 0, !null, 1, 0);
    yield* this.drawLineFromTo(60, -180, 60, -80, !null, 1, 0);
    yield* this.drawLineFromTo(100, -80, 100, 0, !null, 1, 0);
    yield* this.drawLineFromTo(60, -80, 100, -80, !null, 1, 0);
    yield* this.drawLineFromTo(185, 30, 260, 30, !null, 1, 0);
    yield* this.drawLineFromTo(185, 30, 185, -30, !null, 1, 0);
    yield* this.drawLineFromTo(185, -30, 350, -30, !null, 1, 0);
    yield* this.drawLineFromTo(260, 60, 260, 30, !null, 1, 0);
    yield* this.drawLineFromTo(260, 60, 350, 60, !null, 1, 0);
    yield* this.drawLineFromTo(350, -30, 350, 60, !null, 1, 0);
    yield* this.drawLineFromTo(0, 0, -50, 0, !null, 2, 0);
    yield* this.drawLineFromTo(200, -30, 350, -30, !null, 1, 0);
    yield* this.drawRectTo(450, 80, 500, -100, 1);
    yield* this.drawRectTo(800, 100, 850, 50, 1);
    this.stage.vars.y += 2 * this.stage.vars.upDown;
    yield* this.drawRectTo(950, this.stage.vars.y + 120, 1000, 50, 1);
    if (this.stage.vars.y > 120) {
      this.stage.vars.upDown = -1;
    } else {
      if (this.stage.vars.y < -40) {
        this.stage.vars.upDown = 1;
      }
    }
    yield* this.drawLineFromTo(200, 300, 400, 300, !null, 1, 0);
    yield* this.drawLineFromTo(200, 250, 900, 250, !null, 1, 0);
    yield* this.drawRectTo(600, 100, 650, -100, 1);
    yield* this.drawRect2To(700, 300, 750, 350, 1);
    yield* this.drawRectTo(450, 300, 550, 320, 3);
    yield* this.drawRectTo(450, 305, 550, 315, 3);
    yield* this.drawRectTo(450, 305, 550, 310, 3);
    yield* this.drawRectTo(450, 650, 750, 700, 1);
    yield* this.drawRectTo(850, 650, 900, 700, 1);
    yield* this.drawRect2To(550, 300, 600, 400, 1);
    yield* this.drawRect2To(400, 300, 450, this.stage.vars.y * 1 + 500, 1);
    yield* this.drawLineFromTo(450, 300, 550, 300, !null, 1, 0);
    yield* this.drawLineFromTo(600, 300, 700, 300, !null, 1, 0);
    yield* this.drawLineFromTo(200, 300, 200, 250, !null, 1, 0);
    yield* this.drawLineFromTo(900, 300, 900, 250, !null, 1, 0);
    yield* this.drawLineFromTo(750, 300, 900, 300, !null, 1, 0);
    yield* this.drawRectTo(1050, 700, 1100, 650, 4);
  }

  *level2() {
    yield* this.drawRectTo(-100, -50, 100, -100, 1);
    yield* this.drawRectTo(200, 0, 250, -50, 1);
    yield* this.drawRectTo(350, 50, 400, 0, 1);
    yield* this.drawRectTo(500, 100, 550, 50, 1);
    yield* this.drawRectTo(650, 150, 700, 100, 1);
    yield* this.drawRect2To(800, 150, 850, 100, 1);
    yield* this.drawLineFromTo(800, 150, 850, 150, !null, 3, 0);
  }

  *drawRectTo(x5, y6, x6, y7, type4) {
    yield* this.drawLineFromTo(x5, y6, x6, y6, !null, type4, 0);
    yield* this.drawLineFromTo(x5, y7, x6, y7, !null, type4, 0);
    yield* this.drawLineFromTo(x5, y6, x5, y7, !null, type4, 0);
    yield* this.drawLineFromTo(x6, y6, x6, y7, !null, type4, 0);
  }

  *drawRect2To(x7, y8, x8, y9, type5) {
    yield* this.drawLineFromTo(x8, y8, x8, y9, !null, type5, 0);
    yield* this.drawLineFromTo(x7, y9, x8, y9, !null, type5, 0);
    yield* this.drawLineFromTo(x7, y8, x7, y9, !null, type5, 0);
  }
}
