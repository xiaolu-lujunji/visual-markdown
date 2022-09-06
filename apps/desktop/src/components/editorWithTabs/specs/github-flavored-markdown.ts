import type { PhrasingContent } from "./common-mark";

type AlignType = "left" | "center" | "right" | undefined;

export interface Table {
  type: "table";
  align: AlignType[];
  children: TableRow[];
}

export interface TableRow {
  type: "tableRow";
  children: TableCell[];
}

export interface TableCell {
  type: "tableCell";
  children: PhrasingContent[];
}
