import isEqualArray from "../../utils/isEqualArray";
import Fireball from "./Skills/Fireball";

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
          peer.send(
            JSON.stringify({ action: "moveBack" })
          );
          player.moveLeft();
          break;
        case "right":
          peer.send(
            JSON.stringify({ action: "moveFront" })
          );
          player.moveRight();
          break;
        case "up":
          peer.send(
            JSON.stringify({ action: "moveUp" })
          );
          player.moveUp();
          break;
        case "down":
          peer.send(
            JSON.stringify({ action: "moveDown" })
          );
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
    opponent,
    opponentSkills,
    opponentStatusBar,
    playerSkills,
    peer,
  }) {
    peer.on("data", (data) => {
      const opponentAction = JSON.parse(data);

      switch (opponentAction.action) {
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
        case "beHit":
          this.hitPlayer({
            player: opponent,
            playerStatusBar: opponentStatusBar,
            opponentSkills: playerSkills,
            skillIndex: opponentAction.skillIndex,
          });
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

  hitPlayer({
    player,
    playerStatusBar,
    opponentSkills,
    skillIndex,
    peer = null,
  }) {
    const skill = opponentSkills[skillIndex];

    if (skill.handleHit) {
      skill.handleHit();
    }
    player.playBeHitMotion();

    if (peer) {
      peer.send(
        JSON.stringify({
          action: "beHit",
          skillIndex,
        })
      );
    }
  },

  createFireball({
    player,
    peer = null,
    playerSkills,
    isHeadingToRight = true,
    container,
  }) {
    if (peer) {
      peer.send(
        JSON.stringify({ action: "fireball" })
      );
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
