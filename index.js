import { Project } from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import Stage from "./Stage/Stage.js";
import Main from "./Main/Main.js";
import Sprite1 from "./Sprite1/Sprite1.js";

const stage = new Stage({ costumeNumber: 1 });

const sprites = {
  Main: new Main({
    x: 160,
    y: -12.000000000000057,
    direction: 90,
    costumeNumber: 1,
    size: 100,
    visible: true
  }),
  Sprite1: new Sprite1({
    x: 0,
    y: 0,
    direction: 90,
    costumeNumber: 2,
    size: 100,
    visible: false
  })
};

const project = new Project(stage, sprites);
export default project;
