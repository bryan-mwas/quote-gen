import { cva } from "class-variance-authority";
import { GRID_CLASS } from "../constants";

export const inputStyles = cva("", {
  variants: {
    intent: {
      gridStyle: GRID_CLASS,
      normal: "",
    },
  },
});
