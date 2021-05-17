import Fireball from "./Skills/Fireball";
import isEqualArray from "../../utils/isEqualArray";

const mixinSetActionListener = {
  skillCommands: [],

  setSkillCommands() {
    this
      .addSkillCommand({
        command: ["right", "left", "right"],
        useSkill: this.createFireball,
      });
  },

  addSkillCommand(skillInfo) {
    this.skillCommands.push(skillInfo);

    return this;
  },

  handlePlayerActionListen({
    container,
    playerSkills,
    inputtedCommand,
    player,
    peer,
  }) {
    if (inputtedCommand.length === 1) {
      switch (inputtedCommand[0]) {
        case "left":
          peer.send("moveBack");
          player.moveLeft();
          break;
        case "right":
          peer.send("moveFront");
          player.moveRight();
          break;
        case "up":
          peer.send("moveUp");
          player.moveUp();
          break;
        case "down":
          peer.send("moveDown");
          player.moveDown();
          break;
        default:
          break;
      }
    } else {
      for (let i = 0; i < this.skillCommands.length; i += 1) {
        const skillCommand = this.skillCommands[i];
        const { command, useSkill } = skillCommand;

        if (isEqualArray(inputtedCommand, command)) {
          useSkill({
            player,
            peer,
            container,
            playerSkills,
          });
        }
      }
    }
  },

  listenOpponentAction({
    container,
    opponentSkills,
    opponent,
    peer,
  }) {
    peer.on("data", (action) => {
      switch (action) {
        case "moveFront":
          opponent.moveLeft();
          break;
        case "moveBack":
          opponent.moveRight();
          break;
        case "moveUp":
          opponent.moveUp();
          break;
        case "moveDown":
          opponent.moveDown();
          break;
        case "fireball":
          this.createFireball({
            player: opponent,
            container: container,
            playerSkills: opponentSkills,
            isHeadingToRight: false,
          });
          break;
        default:
          break;
      }
    });
  },

  createFireball({
    player,
    container,
    playerSkills,
    peer = false,
    isHeadingToRight = true,
  }) {
    if (peer) {
      peer.send("fireball");
    }

    player.playAttackMotion();
    const fireball = new Fireball({
      x: player.x,
      y: player.y,
      rowIndex: player.rowIndex,
      isHeadingToRight,
    });
    container.addChild(fireball.container);
    playerSkills.push(fireball);
  },
};

export default mixinSetActionListener;
