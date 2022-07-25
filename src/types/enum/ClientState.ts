export enum ClientStateEnum {
  NONE = 0,

  /*== Main state ==*/
  DEADLINK = (0x1 << 12),
  CONNECTION = (0x2 << 12),
  LOGIN = (0x3 << 12),
  PRE_ENTER_SCENE = (0x4 << 12),
  ENTER_SCENE = (0x5 << 12),
  IN_GAME = (0x6 << 12),

  /*== Scene type state ==*/
  SCENE_WORLD = (0x1 << 8),
  SCENE_DUNGEON = (0x2 << 8),

  /*== Sub state ==*/
  // Connection state
  EXCHANGE_TOKEN = CONNECTION | 0x01,

  // Login state
  PICK_TWIN = LOGIN | 0x01,
  POST_LOGIN = LOGIN | 0x02,

  // Enter scene state
  PRE_ENTER_SCENE_READY = 0x01,
  ENTER_SCENE_READY = 0x02,
  PRE_SCENE_INIT_FINISH = 0x03,
  SCENE_INIT_FINISH = 0x04,
  PRE_ENTER_SCENE_DONE = 0x05,
  ENTER_SCENE_DONE = 0x06,
  PRE_POST_ENTER_SCENE = 0x07,

  // In game state
  POST_ENTER_SCENE = 0x00,
  CHANGE_AVATAR = 0x01,
  CHANGE_TEAM = 0x02,
  SETUP_TEAM = 0x03
}