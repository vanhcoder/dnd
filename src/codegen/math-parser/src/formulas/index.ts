import COUNTIF from "./COUNTIF";
import IF from "./IF";
import MAX from "./MAX";
import MIN from "./MIN";
import WEEKDAY from "./WEEKDAY";
import AND from "./AND";
import SUMIF from "./SUMIF";
import SUMIFS from "./SUMIFS";

const formulas = {
  IF,
  MAX,
  MIN,
  WEEKDAY,
  COUNTIF,
  AND,
  SUMIF,
  SUMIFS,
};

export type ExcelFunctions = typeof formulas;

export default formulas;
