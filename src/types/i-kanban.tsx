import { ProposesList } from "@/entities/ipropose";

export interface Column {
  id: string;
  title: string;
  proposeIds: number[];
}

export interface KanbanData {
  proposes: {
    [key: number]: ProposesList;
  };
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
}
