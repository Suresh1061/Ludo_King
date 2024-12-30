export type playerType = {
     id: string,
     pos: number,
     travelCount: number
}

const player1IntialState: playerType[] = [
     { id: 'R1', pos: 0, travelCount: 0 },
     { id: 'R2', pos: 0, travelCount: 0 },
     { id: 'R3', pos: 0, travelCount: 0 },
     { id: 'R4', pos: 0, travelCount: 0 },
]

const player2IntialState: playerType[] = [
     { id: 'G1', pos: 0, travelCount: 0 },
     { id: 'G2', pos: 0, travelCount: 0 },
     { id: 'G3', pos: 0, travelCount: 0 },
     { id: 'G4', pos: 0, travelCount: 0 },
]

const player3IntialState: playerType[] = [
     { id: 'Y1', pos: 0, travelCount: 0 },
     { id: 'Y2', pos: 0, travelCount: 0 },
     { id: 'Y3', pos: 0, travelCount: 0 },
     { id: 'Y4', pos: 0, travelCount: 0 },
]

const player4IntialState: playerType[] = [
     { id: 'B1', pos: 0, travelCount: 0 },
     { id: 'B2', pos: 0, travelCount: 0 },
     { id: 'B3', pos: 0, travelCount: 0 },
     { id: 'B4', pos: 0, travelCount: 0 },
]


export type initialStateType = {
     player1: playerType[],
     player2: playerType[],
     player3: playerType[],
     player4: playerType[],
     chancePlayer: number,
     diceNo: number,
     isDiceRoll: boolean,
     pileSelectionPlyer: number,
     cellSelectionPlyer: number,
     touchDiceBlock: boolean,
     currentPosition: { id: string, pos: number }[],
     fireworks: boolean,
     winner: number | null
}


export const initialState: initialStateType = {
     player1: player1IntialState,
     player2: player2IntialState,
     player3: player3IntialState,
     player4: player4IntialState,
     chancePlayer: 1, // Game starts with Player Red
     diceNo: 1, // Default dice number displayed is 1
     isDiceRoll: false, // Indicates whether the dice has been rolled
     pileSelectionPlyer: -1, // Player currently selecting their home pile (-1 = none)
     cellSelectionPlyer: -1, // Player currently selecting their cell pile (-1 = none)
     touchDiceBlock: false, // Ensures the dice block is disabled after rolling once
     currentPosition: [], // Tracks the positions of players on the board
     fireworks: false, // Indicates if fireworks are active (e.g., for winning)
     winner: null, // Stores the winner's if total travel count is 57 or remains null until there's a winner
}