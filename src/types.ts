
export type Square = {
  id: number;
  name: string;
  icon?: string;
  effect?: { type: string; value?: number; desc?: string };
};

export type Player = {
  id: number;
  name: string;
  pos: number;
  color?: string;
  isPC?: boolean;
};
