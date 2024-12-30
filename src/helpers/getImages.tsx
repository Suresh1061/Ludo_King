import { colors } from "../constants/colors";

type Image = {
     name: string | number;
     image: any;
}

export class getPilesIconImage {
     private static pileImages: Image[] = [
          {
               name: colors.red,
               image: require("../assets/images/piles/red.png")
          },
          {
               name: colors.green,
               image: require("../assets/images/piles/green.png")
          },
          {
               name: colors.blue,
               image: require("../assets/images/piles/blue.png")
          },
          {
               name: colors.yellow,
               image: require("../assets/images/piles/yellow.png")
          },
     ];

     static getImage = (name: string) => {
          const found = this.pileImages.find(e => e.name === name);
          return found ? found.image : null;
     }
}

export class getDiceImage {
     private static diceImages: Image[] = [
          {
               name: 1,
               image: require("../assets/images/dice/1.png")
          },
          {
               name: 2,
               image: require("../assets/images/dice/2.png")
          },
          {
               name: 3,
               image: require("../assets/images/dice/3.png")
          },
          {
               name: 4,
               image: require("../assets/images/dice/4.png")
          },
          {
               name: 5,
               image: require("../assets/images/dice/5.png")
          },
          {
               name:6,
               image:require("../assets/images/dice/6.png")
          }
     ];

     static getImage = (name: number) => {
          const found = this.diceImages.find(e => e.name === name);
          return found ? found.image : null;
     }
}