import { delay } from "../../helpers/delay";
import { safeSpots, starSpots, startingPoints, turningPoints, victoryStarts } from "../../helpers/getPlots";
import { playSound } from "../../helpers/soundUtils";
import { selectCurrentPosition, selectDiceNo } from "./gameSelectors";
import { announceWinner, disableTouch, unfreezeDice, updateFireworks, updatePlayerChance, updatePlayerPileValue } from "./gameSlice";
import { playerType, initialStateType } from "./initialState";
import { ThunkAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
import { store } from "../store"; // Import your store

type RootState = ReturnType<typeof store.getState>;

export const handleForwardThunk = (
     playerNo: number,
     id: string,
     pos: number
): ThunkAction<void, RootState, unknown, AnyAction> =>
     async (dispatch, getState) => {
          const state: RootState = getState();
          const plottedPiles = selectCurrentPosition(state);
          const diceNo = selectDiceNo(state);

          // Determine the player's identifier based on playerNo
          const alpha = playerNo === 1 ? "R" : playerNo === 2 ? "G" : playerNo === 3 ? "Y" : "B";

          // get the pile for the given player and id
          const pile = plottedPiles.find((item) => item.id === id);
          if (!pile) return;

          // Disable touch interactions during movement
          dispatch(disableTouch());

          let finalPath = pile.pos;

          // Get the initial state of the selected player pile
          const beforePlayerPile = state.game[`player${playerNo}` as 'player1' | 'player2' | 'player3' | 'player4']
               .find((item: playerType) => item.id === id);

          if (!beforePlayerPile) return;

          let travelCount = beforePlayerPile.travelCount;

          // Iterate for the value rolled on the dice
          for (let i = 0; i < diceNo; i++) {
               //always get the updated pile's infomation
               const updatedPosition: RootState = getState();
               const playerPile = updatedPosition.game[`player${playerNo}` as 'player1' | 'player2' | 'player3' | 'player4']
                    .find((item: playerType) => item.id === id);

               if (!playerPile) return;

               let path = playerPile.pos + 1;

               // Handle special turning points where paths diverge for specific players
               if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
                    path = victoryStarts[playerNo - 1];
               }

               // Handle circular board positions
               if (path === 53) path = 1;

               finalPath = path;
               travelCount += 1;

               // Update player pile's position and travel count
               dispatch(
                    updatePlayerPileValue({
                         playerNo: `player${playerNo}` as "player1" | "player2" | "player3" | "player4",
                         id: pile.id,
                         pos: path,
                         travelCount,
                    })
               );

               playSound("pile_move");
               await delay(200);
          }

          // Check for collisions at the final position
          const updatedState: RootState = getState();
          const updatedPlottedPiles = selectCurrentPosition(updatedState);

          // get all the piles that are at the final position
          const finalPlot = updatedPlottedPiles?.filter((item) => item.pos === finalPath);
          // extract their ids and check if they are different or not
          const ids = finalPlot.map((item) => item.id[0]);
          const uniqueIds = new Set(ids);
          const areDifferentIds = uniqueIds.size > 1;

          // if the final position is a safe spot
          if (safeSpots.includes(finalPath) || starSpots.includes(finalPath)) {
               playSound("safe_spot");
          }

          //if different piles present at same position and not a safe spot
          if (areDifferentIds &&
               !safeSpots.includes(finalPlot[0].pos) &&
               !starSpots.includes(finalPlot[0].pos)
          ) {
               //check if there is an enemy at the final position with different id
               const enemyPile = finalPlot.find((item) => item.id[0] !== id[0]);

               if (!enemyPile) return;

               const enemyPileId = enemyPile.id[0];

               const no =
                    enemyPileId === "R" ? 1 : enemyPileId === "G" ? 2 : enemyPileId === "Y" ? 3 : 4;

               const backwardPath = startingPoints[no - 1];
               let i = enemyPile.pos;

               playSound("collide");

               // Move the enemy to the starting point in reverse direction
               while (i !== backwardPath) {
                    dispatch(
                         updatePlayerPileValue({
                              playerNo: `player${no}` as "player1" | "player2" | "player3" | "player4",
                              id: enemyPile.id,
                              pos: i,
                              travelCount: 0,
                         })
                    );

                    await delay(200);
                    i--;

                    if (i === 0) i = 52;
               }

               // reset the enemy's position
               dispatch(
                    updatePlayerPileValue({
                         playerNo: `player${no}` as "player1" | "player2" | "player3" | "player4",
                         id: enemyPile.id,
                         pos: 0,
                         travelCount: 0,
                    })
               );

               dispatch(unfreezeDice());
               return;
          }

          //if dice is 6 or player completed his travel
          if (diceNo === 6 || travelCount === 57) {
               dispatch(updatePlayerChance({ playerNo: playerNo }));

               //if player compeleted his travel
               if (travelCount === 57) {
                    playSound("home_win");
                    const finalPlayerState = getState()
                    const playerAllPiles = finalPlayerState.game[`player${playerNo}` as 'player1' | 'player2' | 'player3' | 'player4']

                    if (checkWinningCriteria(playerAllPiles)) {
                         dispatch(announceWinner(playerNo))
                         playSound('cheer')
                         return
                    }

                    dispatch(updateFireworks({ value: true }));
                    dispatch(unfreezeDice())
                    return;
               }
          }
          else {
               let chancePlayer = playerNo + 1;
               if (chancePlayer > 4) {
                    chancePlayer = 1;
               }
               dispatch(updatePlayerChance({ playerNo: chancePlayer }));
          }
     };


export const checkWinningCriteria = (allPiles: playerType[]) => {
     for (let pile of allPiles) {
          if (pile.travelCount < 57) return false
     }
     return true
}
