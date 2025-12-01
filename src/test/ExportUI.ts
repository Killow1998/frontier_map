import { Frame, FRAMEPOINT_BOTTOMRIGHT, FRAMEPOINT_TOPLEFT, Players, Timer, Trigger } from "@eiriksgata/wc3ts/*"
import { KEY_9 } from "src/constants"
import { ButtonTextures } from "src/system/ui/component/Buttom"


type FrameUserData = {
  userId: string
  currentRank: Frame
  nickname: Frame
  gold: Frame
  giftRewardPoints: Frame
  rank: Frame
  heroName: Frame
}


export class ExportUI {

  BackdropSemiTrans: Frame
  FrameTitleByRank: Frame
  FrameTitleByNickname: Frame
  FrameTitleByUserPoints: Frame
  FrameTitleByHeroXp: Frame

  frameWidthUnit = 0.053
  frameHightUnit = 0.03

  frameSrcX = 0.22
  frameSrcY = 0.54


  playerCount = 0

  frameDataList: FrameUserData[] = []
  show = true

  constructor() {

    this.BackdropSemiTrans = Frame.createType("BACKDROP", Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0)!, 0, 'BACKDROP', "")!
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.215030, 0.525990)
      .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.588360, 0.126550)
      .setTexture(ButtonTextures.BLACK_TRANSPARENT, 0, true)

    this.FrameTitleByRank = new Frame("FrameTitleByRank", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.228420, 0.512460)
      .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.274460, 0.490460)
      .setText("|cffFFCC00排名|r")
      .setEnabled(false)
      .setScale(1.00)
      .setTextAlignment(50, 0);

    this.FrameTitleByNickname = new Frame("FrameTitleByNickname", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.275300, 0.512460)
      .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.352310, 0.490460)
      .setText("|cffFFCC00用户|r")
      .setEnabled(false)
      .setScale(1.00)
      .setTextAlignment(50, 0);

    this.FrameTitleByUserPoints = new Frame("FrameTitleByUserPoints", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.351470, 0.512460)
      .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.404210, 0.490460)
      .setText("|cffFFCC00金币|r")
      .setEnabled(false)
      .setScale(1.00)
      .setTextAlignment(50, 0);
    this.FrameTitleByHeroXp = new Frame("FrameTitleByHeroXp", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.404210, 0.512460)
      .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.465320, 0.490460)
      .setText("|cffFFCC00积分|r")
      .setEnabled(false)
      .setScale(1.00)
      .setTextAlignment(50, 0);
    this.FrameTitleByHeroXp = new Frame("FrameTitleByHeroXp", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.465310, 0.511620)
      .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.521390, 0.489620)
      .setText("|cffFFCC00世界排名|r")
      .setEnabled(false)
      .setScale(1.00)
      .setTextAlignment(50, 0);
    this.FrameTitleByHeroXp = new Frame("FrameTitleByHeroXp", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
      .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.522230, 0.512460)
      .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.575800, 0.490460)
      .setText("|cffFFCC00当前船只|r")
      .setEnabled(false)
      .setScale(1.00)
      .setTextAlignment(50, 0);

    //this.BackdropSemiTrans.setVisible(false);


    this.registerShowBtn()

    // const _this = this;
    // Timer.create().start(1, true, function () {
    //   _this.updateList();
    // })
  }

  updateList() {
    // const result = User.getSortedGiftRewardList()
    // for (let i = 0; i < this.frameDataList.length; i++) {
    //   const userId = result[i][0];
    //   const userData = result[i][1];
    //   this.frameDataList[i].currentRank.setText(i + 1 + "")
    //   this.frameDataList[i].nickname.setText(User.serverData[userId].nickname)
    //   this.frameDataList[i].giftRewardPoints.setText(`${NumberTool.bigNumberTransform(User.serverData[userId].userPoints)}(+${TextFontColor.golden(userData.giftRewardPoints + '')})`)
    //   this.frameDataList[i].rank.setText(User.serverData[userId].rank + "")
    //   this.frameDataList[i].heroName.setText(userData.currentHero?.nameProper || "无");
    //   this.frameDataList[i].gold.setText(`${TextFontColor.golden(User.gameData[userId].gold + '')}`);

    //   //EricConsole.log(`${userId}:${userData.giftRewardPoints}`)
    // }
  }

  addUser(userId: string) {
    if (this.playerCount > 10) return
    this.playerCount = this.playerCount + 1

    const frame: FrameUserData = {
      userId: userId,
      currentRank: new Frame("currentRank", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.228420, 0.512460 - this.playerCount * this.frameHightUnit)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.274460, 0.490460 - this.playerCount * this.frameHightUnit)
        .setText("0")
        .setEnabled(false)
        .setScale(1.00),

      nickname: new Frame("nickname", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.275300, 0.512460 - this.playerCount * this.frameHightUnit)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.352310, 0.490460 - this.playerCount * this.frameHightUnit)
        .setText("")
        .setEnabled(false)
        .setScale(1.00),

      gold: new Frame("gold", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.351470, 0.512460 - this.playerCount * this.frameHightUnit)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.404210, 0.490460 - this.playerCount * this.frameHightUnit)
        .setText("0")
        .setEnabled(false)
        .setScale(1.00),

      giftRewardPoints: new Frame("giftRewardPoints", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.404210, 0.512460 - this.playerCount * this.frameHightUnit)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.465320, 0.490460 - this.playerCount * this.frameHightUnit)
        .setText("0")
        .setEnabled(false)
        .setScale(1.00),

      rank: new Frame("rank", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.465310, 0.511620 - this.playerCount * this.frameHightUnit)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.521390, 0.489620 - this.playerCount * this.frameHightUnit)
        .setText("|cffFFCC00无|r")
        .setEnabled(false)
        .setScale(1.00),

      heroName: new Frame("heroName", this.BackdropSemiTrans, 0, 0, 'TEXT', "")
        .setAbsPoint(FRAMEPOINT_TOPLEFT, 0.522230, 0.512460 - this.playerCount * this.frameHightUnit)
        .setAbsPoint(FRAMEPOINT_BOTTOMRIGHT, 0.575800, 0.490460 - this.playerCount * this.frameHightUnit)
        .setText("|cffFFCC00无|r")
        .setEnabled(false)
        .setScale(1.00)
    };
    this.frameDataList.push(frame);
  }

  registerShowBtn() {
    const _this = this;
    const trg = Trigger.create()
    for (let i = 0; i < 24; i++) {
      trg.registerPlayerKeyEvent(trg.handle, KEY_9, 1, true, function () {
        if (_this.show) {
          _this.BackdropSemiTrans.setVisible(false)
          _this.show = false
        } else {
          _this.BackdropSemiTrans.setVisible(true)
          _this.show = true
        }
      });
    }
  }
}