import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const rollDice = (): number => Math.floor(Math.random() * 6) + 1;

export const getRandomEvent = (): GameEvent => {
  const events: GameEvent[] = [
    { type: 'bonus', message: '昇進しました！', value: 2 },
    { type: 'penalty', message: '体調不良で休憩', value: -1 },
    { type: 'bonus', message: '宝くじが当たった！', value: 3 },
    { type: 'penalty', message: '道に迷いました', value: -2 },
    { type: 'neutral', message: '平凡な一日', value: 0 },
  ];
  return events[Math.floor(Math.random() * events.length)] as GameEvent;
};

export interface GameEvent {
  type: 'bonus' | 'penalty' | 'neutral';
  message: string;
  value: number;
}
