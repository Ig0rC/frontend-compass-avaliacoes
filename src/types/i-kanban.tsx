import { ProposeList } from "@/entities/ipropose";

export interface Column {
  id: string;
  title: string;
  proposeIds: number[];
}

export interface KanbanData {
  proposes: {
    [key: number]: ProposeList;
  };
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
}
