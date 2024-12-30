import { initialStateType } from "./initialState";

export const selectCurrentPosition = (state: { game: initialStateType }) => state.game.currentPosition
export const selectCurrentPlayerChance = (state: { game: initialStateType }) => state.game.chancePlayer
export const selectIsDiceRolled = (state: { game: initialStateType }) => state.game.isDiceRoll
export const selectDiceNo = (state: { game: initialStateType }) => state.game.diceNo

export const selectPlayer1 = (state: { game: initialStateType }) => state.game.player1;
export const selectPlayer2 = (state: { game: initialStateType }) => state.game.player2;
export const selectPlayer3 = (state: { game: initialStateType }) => state.game.player3;
export const selectPlayer4 = (state: { game: initialStateType }) => state.game.player4;

export const selectHomePile = (state: { game: initialStateType }) => state.game.pileSelectionPlyer
export const selectCellPile = (state: { game: initialStateType }) => state.game.cellSelectionPlyer
export const selectIsDiceTouch = (state: { game: initialStateType }) => state.game.touchDiceBlock
export const selectIsFireworks = (state: { game: initialStateType }) => state.game.fireworks
export const selectWinner = (state: { game: initialStateType }) => state.game.winner