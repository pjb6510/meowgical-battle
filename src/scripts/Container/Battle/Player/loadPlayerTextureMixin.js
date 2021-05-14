import globalStore from "../../../globalStore";

const loadPlayerTextureMixin = {
  loadPlayerTexture() {
    if (this.isHost) {
      const {
        hostPlayer,
        hostPlayerMoveFront,
        hostPlayerMoveBack,
        hostPlayerAttack1,
        hostPlayerAttack2,
        hostPlayerAttack3,
      } = globalStore.getItem("resources");

      this.playerTexture = {
        normal: hostPlayer.texture,
        moveFront: hostPlayerMoveFront.texture,
        moveBack: hostPlayerMoveBack.texture,
        attack1: hostPlayerAttack1.texture,
        attack2: hostPlayerAttack2.texture,
        attack3: hostPlayerAttack3.texture,
      };
    } else {
      const {
        guestPlayer,
        guestPlayerMoveFront,
        guestPlayerMoveBack,
        guestPlayerAttack1,
        guestPlayerAttack2,
        guestPlayerAttack3,
      } = globalStore.getItem("resources");

      this.playerTexture = {
        normal: guestPlayer.texture,
        moveFront: guestPlayerMoveFront.texture,
        moveBack: guestPlayerMoveBack.texture,
        attack1: guestPlayerAttack1.texture,
        attack2: guestPlayerAttack2.texture,
        attack3: guestPlayerAttack3.texture,
      };
    }
  },
};

export default loadPlayerTextureMixin;
