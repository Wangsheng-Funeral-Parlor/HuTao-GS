// TODO: maybe it can more beautiful
export default function gameConstants() {}

export class GameConstants {
    public static START_POSITION: { x: number; y: number; z: number } = { x: -657.9599609375, y: 219.54281616210938, z: 266.7440490722656 };

    public static SERVER_CONSOLE_UID: number = 2333333;

    public static DEFAULT_TEAMS: number = 4;
    public static MAX_TEAMS: number = 4;

    public static MAX_FRIENDS: number = 60;
    public static MAX_FRIEND_REQUESTS: number = 50;

    public static BATTLE_PASS_MAX_LEVEL = 50;
    public static BATTLE_PASS_POINT_PER_LEVEL = 1000;
    public static BATTLE_PASS_POINT_PER_WEEK = 10000;
    public static BATTLE_PASS_LEVEL_PRICE = 150;
    public static BATTLE_PASS_CURRENT_INDEX = 2;

    public static SECOND: number = 1000; //1 Second
    public static MINUTE: number = GameConstants.SECOND * 60; //1 Minute
    public static HOUR: number = GameConstants.MINUTE * 60; //1 Hour
    public static DAY: number = GameConstants.HOUR * 24; //1 Day
    public static DEFAULT_REFRESH_TIME: number = GameConstants.HOUR * 6; // default 6 Hours
}