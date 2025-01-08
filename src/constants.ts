import { cva } from "class-variance-authority";

export const GRID_CLASS = "grid grid-cols-2 items-baseline justify-between";

export const gridLayoutFormInput = cva(null, {
  variants: {
    gridLayout: {
      true: GRID_CLASS,
    },
  },
});
