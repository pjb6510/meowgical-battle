import globalStore from "../../../globalStore";

const mixinLoadPlayerTexture = {
  loadPlayerTexture() {
    if (this.isHost) {
      const {
        hostPlayer,
        hostPlayerMoveFront,
        hostPlayerMoveBack,
        hostPlayerAttackMotion,
      } = globalStore.getItem("resources");

      this.playerTextures = {
        normal: hostPlayer.texture,
        moveFront: hostPlayerMoveFront.texture,
        moveBack: hostPlayerMoveBack.texture,
        attackMotion: Object.values(hostPlayerAttackMotion.textures),
      };
    } else {
      const {
        guestPlayer,
        guestPlayerMoveFront,
        guestPlayerMoveBack,
        guestPlayerAttackMotion,
      } = globalStore.getItem("resources");

      this.playerTextures = {
        normal: guestPlayer.texture,
        moveFront: guestPlayerMoveFront.texture,
        moveBack: guestPlayerMoveBack.texture,
        attackMotion: Object.values(guestPlayerAttackMotion.textures),
      };
    }
  },
};

export default mixinLoadPlayerTexture;
