import { createContext, SetStateAction, Dispatch } from "react";

export const allGenerations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const GenerationsContext = createContext({generations: allGenerations, setGenerations: (() => {}) as any});
export const genRangesPokemon = [
  1, 152, 252, 387, 494, 650, 722, 810, 906, 1026,
];
export const genRangesMoves = [1, 166, 252, 355, 468, 560, 622, 743, 851, 920];
