export interface PartialItem {
  label: string;
}

export interface Item extends PartialItem {
  id: string;
  createdAt: number;
}

export interface DateFilter {
  from: number;
  to: number;
}

export interface StoreState {
  data: Record<string, Item>;
  total: number;
  filter: DateFilter;
}