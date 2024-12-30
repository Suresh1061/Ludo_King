import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, playerType } from "./initialState";

const gameSlice = createSlice({
     name: "game",
     initialState,
     reducers: {
          resetGame: () => initialState,
          updateDiceNo: (state, action: PayloadAction<{ diceNo: number }>) => {
               state.diceNo = action.payload.diceNo;
               state.isDiceRoll = true;
          },
          enableHomePileSelection: (state, action: PayloadAction<{ playerNo: number }>) => {
               state.touchDiceBlock = true;
               state.pileSelectionPlyer = action.payload.playerNo
          },
          enableCellPileSelection: (state, action: PayloadAction<{ playerNo: number }>) => {
               state.touchDiceBlock = true;
               state.cellSelectionPlyer = action.payload.playerNo
          },
          disableTouch: (state) => {
               state.touchDiceBlock = true;
               state.pileSelectionPlyer = -1;
               state.cellSelectionPlyer = -1;
          },
          unfreezeDice: (state) => {
               state.touchDiceBlock = false
               state.isDiceRoll = false
          },
          updateFireworks: (state, action: PayloadAction<{ value: boolean }>) => {
               state.fireworks = action.payload.value;
          },
          announceWinner: (state, action) => {
               state.winner = action.payload
          },
          updatePlayerChance: (state, action: PayloadAction<{ playerNo: number }>) => {
               state.chancePlayer = action.payload.playerNo
               state.touchDiceBlock = false;
               state.isDiceRoll = false;
          },
          updatePlayerPileValue: (
               state,
               action: PayloadAction<{
                    playerNo: 'player1' | 'player2' | 'player3' | 'player4',
                    id: string,
                    pos: number,
                    travelCount: number
               }>) => {
               const { playerNo, id, pos, travelCount } = action.payload

               const player = state[playerNo]

               const pile = player.find(p => p.id === id)
               state.pileSelectionPlyer = -1;

               if (pile) {
                    pile.pos = pos;
                    pile.travelCount = travelCount;
                    const currentPositionIndex = state.currentPosition.findIndex(p => p.id === id);

                    if (pos === 0) {
                         //if pile is at home (as pos = 0) then remove the piles details from currentPosition
                         if (currentPositionIndex !== -1) {
                              state.currentPosition.splice(currentPositionIndex, 1);
                         }
                    } else {
                         //if pos != 0 and currentPositionIndex is not -1 then update the currentPosition
                         if (currentPositionIndex !== -1) {
                              state.currentPosition[currentPositionIndex] = {
                                   id,
                                   pos
                              }
                         } else {
                              //if pos != 0 and currentPositionIndex is -1 then add the piles details to currentPosition
                              state.currentPosition.push({ id, pos })
                         }
                    }
               }
          }
     },
});

export const {
     resetGame,
     updateDiceNo,
     enableHomePileSelection,
     enableCellPileSelection,
     disableTouch,
     unfreezeDice,
     updateFireworks,
     announceWinner,
     updatePlayerChance,
     updatePlayerPileValue,
} = gameSlice.actions;

export default gameSlice.reducer;