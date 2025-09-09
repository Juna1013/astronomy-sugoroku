// src/hooks/useGameState.ts の更新版
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Player, Square } from '../types';
import demoSquaresHard from '../data/squares-hard.json';
import demoSquaresEasy from '../data/squares-easy.json';
import demoSquaresNormal from '../data/squares-normal.json';

export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export type GameEvent = { type: string; message: string; value: number };

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  isGameOver: boolean;
  winner: Player | null;
  diceValue: number;
  isRolling: boolean;
  lastEvent: GameEvent | null;
  started: boolean;
}

// ポップアップ用の新しい状態追加
export interface PopupState {
  show: boolean;
  square: Square | null;
  playerName: string;
}

export const useGameState = () => {
  const [started, setStarted] = useState(false);
  const [isPCMode, setIsPCMode] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [diceDisabled, setDiceDisabled] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);
  
  // ポップアップ状態
  const [popupState, setPopupState] = useState<PopupState>({
    show: false,
    square: null,
    playerName: ''
  });

  // サイコロ結果エフェクト状態
  const [diceResultState, setDiceResultState] = useState({
    show: false,
    value: 0,
    playerName: ''
  });

  // 休みエフェクト状態
  const [restEffectState, setRestEffectState] = useState({
    show: false,
    playerName: '',
    restTurns: 0,
    restReason: ''
  });

  // 難易度に応じたマスデータを取得
  const getCurrentSquares = useCallback(() => {
    switch (difficulty) {
      case 'easy':
        return demoSquaresEasy as Square[];
      case 'normal':
        return demoSquaresNormal as Square[];
      case 'hard':
        return demoSquaresHard as Square[];
      default:
        return demoSquaresNormal as Square[];
    }
  }, [difficulty]);

  const demoSquares = getCurrentSquares();
  const lastIndex = demoSquares.length - 1;

  const initPlayers = (pcMode: boolean): Player[] => {
    if (pcMode) {
      return [
        { id: 1, name: 'あなた', pos: 0, color: '#ef4444', isPC: false, restTurns: 0, restReason: '', curseTurns: 0, confusionTurns: 0, lastPos: 0 },
        { id: 2, name: 'AI', pos: 0, color: '#3b82f6', isPC: true, restTurns: 0, restReason: '', curseTurns: 0, confusionTurns: 0, lastPos: 0 },
      ];
    } else {
      return [
        { id: 1, name: 'プレイヤー1', pos: 0, color: '#ef4444', isPC: false, restTurns: 0, restReason: '', curseTurns: 0, confusionTurns: 0, lastPos: 0 },
        { id: 2, name: 'プレイヤー2', pos: 0, color: '#10b981', isPC: false, restTurns: 0, restReason: '', curseTurns: 0, confusionTurns: 0, lastPos: 0 },
      ];
    }
  };

  const endGame = useCallback((winnerPlayer: Player) => {
    setWinner(winnerPlayer);
    setGameEnded(true);
    setDiceDisabled(true);
    setIsRolling(false);
  }, []);

  const checkGoal = useCallback((pl: Player[]) => {
    const w = pl.find((p) => p.pos >= lastIndex);
    return w ?? null;
  }, [lastIndex]);

  const movePlayerBy = useCallback((pl: Player[], idx: number, steps: number): Promise<Player[]> => {
    return new Promise((resolve) => {
      let currentPlayers = pl.map((p) => ({ ...p }));
      let remainingSteps = Math.abs(steps);
      const direction = steps > 0 ? 1 : -1;

      if (remainingSteps === 0) {
        resolve(currentPlayers);
        return;
      }

      const moveOneStep = () => {
        if (remainingSteps > 0) {
          const newPos = Math.max(0, Math.min(currentPlayers[idx].pos + direction, lastIndex));
          if (newPos !== currentPlayers[idx].pos) {
            currentPlayers[idx].pos = newPos;
            setPlayers([...currentPlayers]); // 移動を視覚的に表示
          }
          remainingSteps--;
          
          if (remainingSteps > 0 && currentPlayers[idx].pos < lastIndex && currentPlayers[idx].pos > 0) {
            setTimeout(moveOneStep, 300); // 300msごとに1マス移動
          } else {
            resolve(currentPlayers);
          }
        } else {
          resolve(currentPlayers);
        }
      };

      setTimeout(moveOneStep, 100); // 初回の移動まで少し待機
    });
  }, [lastIndex]);

  // ポップアップを表示する関数
  const showSquarePopup = useCallback((square: Square, playerName: string) => {
    setPopupState({
      show: true,
      square,
      playerName
    });
  }, []);

  // ポップアップを閉じる関数
  const hideSquarePopup = useCallback(() => {
    setPopupState({
      show: false,
      square: null,
      playerName: ''
    });
  }, []);

  const applySquareEffect = useCallback((plSnapshot: Player[], playerIdx: number): Player[] => {
    const player = plSnapshot[playerIdx];
    const sq = demoSquares[player.pos] as Square;
    const nextPlayers = plSnapshot.map((p) => ({ ...p }));

    // ポップアップを表示
    showSquarePopup(sq, player.name);

    if (!sq.effect) return nextPlayers;

    const effect = sq.effect;

    switch (effect.type) {
      case 'move':
        if (typeof effect.value === 'number') {
          nextPlayers[playerIdx].pos = Math.max(0, Math.min(nextPlayers[playerIdx].pos + effect.value, lastIndex));
          setLastEvent({
            type: effect.value > 0 ? 'bonus' : 'penalty',
            message: effect.desc || `${effect.value > 0 ? '+' : ''}${effect.value} マス移動`,
            value: effect.value
          });
        }
        break;

      case 'teleport':
        if (typeof effect.value === 'number') {
          nextPlayers[playerIdx].pos = Math.max(0, Math.min(effect.value, lastIndex));
          setLastEvent({
            type: 'bonus',
            message: effect.desc || `マス${effect.value}にワープ`,
            value: 0
          });
        }
        break;

      case 'swap':
        // 他のプレイヤーと位置を交換
        const otherPlayerIdx = nextPlayers.findIndex((p, idx) => idx !== playerIdx);
        if (otherPlayerIdx !== -1) {
          const tempPos = nextPlayers[playerIdx].pos;
          nextPlayers[playerIdx].pos = nextPlayers[otherPlayerIdx].pos;
          nextPlayers[otherPlayerIdx].pos = tempPos;
          setLastEvent({
            type: 'bonus',
            message: effect.desc || '位置を交換',
            value: 0
          });
        }
        break;

      case 'random_move':
        if (Array.isArray(effect.value)) {
          const randomValue = effect.value[Math.floor(Math.random() * effect.value.length)];
          nextPlayers[playerIdx].pos = Math.max(0, Math.min(nextPlayers[playerIdx].pos + randomValue, lastIndex));
          setLastEvent({
            type: randomValue > 0 ? 'bonus' : 'penalty',
            message: effect.desc || `ランダムで${randomValue > 0 ? '+' : ''}${randomValue}マス移動`,
            value: randomValue
          });
        }
        break;

      case 'energy_burst':
        if (Array.isArray(effect.value) && effect.value.length === 2) {
          const isPositive = Math.random() > 0.5;
          const moveValue = isPositive ? effect.value[1] : effect.value[0];
          nextPlayers[playerIdx].pos = Math.max(0, Math.min(nextPlayers[playerIdx].pos + moveValue, lastIndex));
          setLastEvent({
            type: moveValue > 0 ? 'bonus' : 'penalty',
            message: effect.desc || `エネルギー噴射で${moveValue > 0 ? '+' : ''}${moveValue}マス`,
            value: moveValue
          });
        }
        break;

      case 'big_bang':
        // 全プレイヤーをスタートに戻す
        nextPlayers.forEach(p => p.pos = 0);
        setLastEvent({
          type: 'penalty',
          message: effect.desc || 'ビッグバンで全員スタートに戻る',
          value: 0
        });
        break;

      case 'gravity':
        // 全プレイヤーが1マス引き寄せられる（現在の位置に向かって）
        nextPlayers.forEach((p, idx) => {
          if (idx !== playerIdx && p.pos > player.pos) {
            p.pos = Math.max(player.pos, p.pos - 1);
          }
        });
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '重力で他プレイヤーが引き寄せられる',
          value: 0
        });
        break;

      case 'move_to_nearest':
        // 最も近い効果のあるマスに移動
        let nearestEffectSquare = -1;
        let minDistance = Infinity;
        for (let i = 0; i < demoSquares.length; i++) {
          if (i !== player.pos && demoSquares[i].effect) {
            const distance = Math.abs(i - player.pos);
            if (distance < minDistance) {
              minDistance = distance;
              nearestEffectSquare = i;
            }
          }
        }
        if (nearestEffectSquare !== -1) {
          nextPlayers[playerIdx].pos = nearestEffectSquare;
          setLastEvent({
            type: 'bonus',
            message: effect.desc || `最も近い効果マス(${nearestEffectSquare})に移動`,
            value: 0
          });
        }
        break;

      case 'roll_again':
        // サイコロをもう一度振る（次のターンで実装）
        setLastEvent({
          type: 'bonus',
          message: effect.desc || 'もう一度サイコロを振れる',
          value: 0
        });
        break;

      case 'rest':
        // 1回休み効果
        nextPlayers[playerIdx].restTurns = (nextPlayers[playerIdx].restTurns || 0) + 1;
        nextPlayers[playerIdx].restReason = effect.desc || '1回休み';
        setRestEffectState({
          show: true,
          playerName: player.name,
          restTurns: nextPlayers[playerIdx].restTurns || 1,
          restReason: effect.desc || '1回休み'
        });
        setTimeout(() => {
          setRestEffectState({ show: false, playerName: '', restTurns: 0, restReason: '' });
        }, 2500);
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '1回休み',
          value: 0
        });
        break;

      case 'chaos':
        // 全プレイヤーの位置をシャッフル
        const shuffledPositions = nextPlayers.map(p => p.pos).sort(() => Math.random() - 0.5);
        nextPlayers.forEach((p, idx) => {
          p.pos = shuffledPositions[idx];
        });
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '全プレイヤーの位置がシャッフル',
          value: 0
        });
        break;

      case 'curse':
        // 呪い効果：5ターン移動距離半減
        nextPlayers[playerIdx].curseTurns = 5;
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '呪いがかかった',
          value: 0
        });
        break;

      case 'freeze':
        // 凍結効果：2回休み
        nextPlayers[playerIdx].restTurns = (nextPlayers[playerIdx].restTurns || 0) + 2;
        nextPlayers[playerIdx].restReason = effect.desc || '2回休み';
        setRestEffectState({
          show: true,
          playerName: player.name,
          restTurns: nextPlayers[playerIdx].restTurns || 2,
          restReason: effect.desc || '2回休み'
        });
        setTimeout(() => {
          setRestEffectState({ show: false, playerName: '', restTurns: 0, restReason: '' });
        }, 2500);
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '2回休み',
          value: 0
        });
        break;

      case 'volcano':
        // 火山爆発：前にいる全プレイヤーを後ろに
        nextPlayers.forEach((p, idx) => {
          if (idx !== playerIdx && p.pos > player.pos) {
            p.pos = Math.max(0, p.pos - 5);
          }
        });
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '火山爆発で前のプレイヤーが後退',
          value: 0
        });
        break;

      case 'geyser':
        // 間欠泉で大ジャンプ
        nextPlayers[playerIdx].pos = Math.min(nextPlayers[playerIdx].pos + 8, lastIndex);
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '間欠泉で8マス飛躍',
          value: 8
        });
        break;

      case 'snipe':
        // 最も進んでいるプレイヤーを狙撃
        const leadPlayerIdx = nextPlayers.reduce((maxIdx, p, idx) => 
          p.pos > nextPlayers[maxIdx].pos ? idx : maxIdx, 0);
        if (leadPlayerIdx !== playerIdx) {
          nextPlayers[leadPlayerIdx].pos = Math.max(0, nextPlayers[leadPlayerIdx].pos - 8);
        }
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '最前列プレイヤーを狙撃',
          value: 0
        });
        break;

      case 'black_hole':
        // ブラックホール：スタートに戻る
        nextPlayers[playerIdx].pos = 0;
        setLastEvent({
          type: 'penalty',
          message: effect.desc || 'ブラックホールでスタートに',
          value: 0
        });
        break;

      case 'wormhole':
        // ワームホール：大幅前進
        nextPlayers[playerIdx].pos = Math.min(nextPlayers[playerIdx].pos + 35, lastIndex);
        setLastEvent({
          type: 'bonus',
          message: effect.desc || 'ワームホールで35マス先に',
          value: 35
        });
        break;

      case 'comet_tail':
        // 彗星の尻尾：3ターン混乱
        nextPlayers[playerIdx].confusionTurns = 3;
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '3ターン混乱状態',
          value: 0
        });
        break;

      case 'galactic_center':
        // 銀河中心：中央付近に移動
        const centerPos = Math.floor(lastIndex / 2);
        nextPlayers[playerIdx].pos = centerPos;
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '銀河中心に移動',
          value: 0
        });
        break;

      case 'nebula_birth':
        // 星雲誕生：7マス進む
        nextPlayers[playerIdx].pos = Math.min(nextPlayers[playerIdx].pos + 7, lastIndex);
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '新星誕生で7マス進む',
          value: 7
        });
        break;

      case 'supernova':
        // 超新星爆発：全プレイヤーが10マス吹き飛ぶ
        nextPlayers.forEach(p => {
          p.pos = Math.min(p.pos + 10, lastIndex);
        });
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '超新星爆発で全員10マス進む',
          value: 10
        });
        break;

      case 'neutron_pulse':
        // 中性子星パルス：時間逆行
        if (nextPlayers[playerIdx].lastPos !== undefined) {
          nextPlayers[playerIdx].pos = nextPlayers[playerIdx].lastPos || 0;
        }
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '時間逆行で前の位置に',
          value: 0
        });
        break;

      case 'magnetic_storm':
        // 磁気嵐：3回休み
        nextPlayers[playerIdx].restTurns = (nextPlayers[playerIdx].restTurns || 0) + 3;
        nextPlayers[playerIdx].restReason = effect.desc || '磁気嵐で3回休み';
        setRestEffectState({
          show: true,
          playerName: player.name,
          restTurns: nextPlayers[playerIdx].restTurns || 3,
          restReason: effect.desc || '磁気嵐で3回休み'
        });
        setTimeout(() => {
          setRestEffectState({ show: false, playerName: '', restTurns: 0, restReason: '' });
        }, 2500);
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '磁気嵐で3回休み',
          value: 0
        });
        break;

      case 'quasar_beam':
        // クエーサービーム：15マス飛躍
        nextPlayers[playerIdx].pos = Math.min(nextPlayers[playerIdx].pos + 15, lastIndex);
        setLastEvent({
          type: 'bonus',
          message: effect.desc || 'クエーサービームで15マス飛躍',
          value: 15
        });
        break;

      case 'dark_matter':
        // ダークマター：ランダム効果
        const randomEffects = ['move', 'teleport', 'swap', 'rest'];
        const randomEffect = randomEffects[Math.floor(Math.random() * randomEffects.length)];
        if (randomEffect === 'move') {
          const randomMove = Math.floor(Math.random() * 21) - 10; // -10 to +10
          nextPlayers[playerIdx].pos = Math.max(0, Math.min(nextPlayers[playerIdx].pos + randomMove, lastIndex));
        }
        setLastEvent({
          type: 'bonus',
          message: effect.desc || 'ダークマターの謎の力',
          value: 0
        });
        break;

      case 'dark_energy':
        // ダークエネルギー：全員が離散
        nextPlayers.forEach((p, idx) => {
          const spread = Math.floor(Math.random() * 20) - 10;
          p.pos = Math.max(0, Math.min(p.pos + spread, lastIndex));
        });
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '宇宙膨張で全員離散',
          value: 0
        });
        break;

      case 'spacetime_warp':
        // 時空歪み：過去か未来へ
        const isPast = Math.random() > 0.5;
        const timeJump = isPast ? -15 : 15;
        nextPlayers[playerIdx].pos = Math.max(0, Math.min(nextPlayers[playerIdx].pos + timeJump, lastIndex));
        setLastEvent({
          type: isPast ? 'penalty' : 'bonus',
          message: effect.desc || `${isPast ? '過去' : '未来'}へ時間移動`,
          value: timeJump
        });
        break;

      case 'edge_of_universe':
        // 宇宙の果て：反射で大幅後退
        nextPlayers[playerIdx].pos = Math.max(0, nextPlayers[playerIdx].pos - 12);
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '宇宙の端で反射',
          value: -12
        });
        break;

      case 'dimensional_rift':
        // 次元の裂け目：ランダムワープ
        nextPlayers[playerIdx].pos = Math.floor(Math.random() * lastIndex);
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '別次元にワープ',
          value: 0
        });
        break;

      case 'god_zone':
        // 神の領域：極端な効果
        const godEffects = [
          () => nextPlayers[playerIdx].pos = lastIndex - 1, // ゴール直前
          () => nextPlayers[playerIdx].pos = 0, // スタートに戻る
          () => nextPlayers.forEach(p => p.pos = Math.floor(Math.random() * lastIndex)), // 全員ランダム
        ];
        const randomGodEffect = godEffects[Math.floor(Math.random() * godEffects.length)];
        randomGodEffect();
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '神の気まぐれ',
          value: 0
        });
        break;

      case 'heat_death':
        // 宇宙の熱的死：全員リセット
        nextPlayers.forEach(p => p.pos = 0);
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '宇宙の熱的死で全員リセット',
          value: 0
        });
        break;

      case 'big_crunch':
        // ビッグクランチ：全員ゴール付近に
        nextPlayers.forEach(p => p.pos = Math.max(lastIndex - 5, Math.floor(Math.random() * 5) + lastIndex - 5));
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '宇宙収縮で全員ゴール付近に',
          value: 0
        });
        break;

      case 'big_rip':
        // ビッグリップ：位置関係混沌
        const positions = nextPlayers.map(p => p.pos);
        positions.sort(() => Math.random() - 0.5);
        nextPlayers.forEach((p, idx) => p.pos = positions[idx]);
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '時空破綻で位置混沌',
          value: 0
        });
        break;

      case 'new_big_bang':
        // 新ビッグバン：全員新スタート
        nextPlayers.forEach(p => {
          p.pos = Math.floor(Math.random() * 10); // 0-9のランダム位置
          p.restTurns = 0;
          p.curseTurns = 0;
          p.confusionTurns = 0;
        });
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '新宇宙で新たなスタート',
          value: 0
        });
        break;

      case 'ultimate_truth':
        // 究極の真理：ゲーム勝利確定
        nextPlayers[playerIdx].pos = lastIndex;
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '宇宙の真理到達でゲーム勝利',
          value: 0
        });
        break;

      case 'chaos_vortex':
        // 混沌の渦：完全ランダム
        nextPlayers.forEach(p => {
          p.pos = Math.floor(Math.random() * lastIndex);
          if (Math.random() > 0.7) p.restTurns = Math.floor(Math.random() * 3) + 1;
          if (Math.random() > 0.8) p.curseTurns = Math.floor(Math.random() * 3) + 1;
        });
        setLastEvent({
          type: 'penalty',
          message: effect.desc || '混沌の渦で全てが予測不能',
          value: 0
        });
        break;

      case 'shield':
      case 'double_next':
      case 'lucky':
      case 'mystery':
      case 'reflection':
      case 'parallel':
      case 'infinite_loop':
      case 'parallel_universe':
      case 'cosmic_consciousness':
      case 'genesis_light':
      case 'apocalypse_dark':
      case 'time_keeper':
      case 'space_ruler':
      case 'causality_break':
      case 'fate_crossroad':
      case 'miracle_moment':
      case 'despair_abyss':
        // 特殊効果（将来の実装用）
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '特殊効果発動',
          value: 0
        });
        break;

      default:
        setLastEvent({
          type: 'bonus',
          message: effect.desc || '効果発動',
          value: 0
        });
    }

    return nextPlayers;
  }, [lastIndex, showSquarePopup, demoSquares]);

  const handleStart = useCallback((pcMode: boolean = false, selectedDifficulty: DifficultyLevel = 'normal') => {
    setIsPCMode(pcMode);
    setDifficulty(selectedDifficulty);
    const initial = initPlayers(pcMode);
    setPlayers(initial);
    setCurrentPlayerIdx(0);
    setStarted(true);
    setDiceDisabled(false);
    setGameEnded(false);
    setWinner(null);
    setLastEvent(null);
    setDiceValue(1);
    setIsRolling(false);
    setDiceResultState({ show: false, value: 0, playerName: '' });
    setRestEffectState({ show: false, playerName: '', restTurns: 0, restReason: '' });
    hideSquarePopup();
  }, [hideSquarePopup]);

  const processPlayerTurn = useCallback(async (playerIndex: number, rollValue: number) => {
    return new Promise<void>(async (resolve) => {
      const snapshot = players.map(p => ({ ...p }));
      
      try {
        // 前回位置を記録
        snapshot[playerIndex].lastPos = snapshot[playerIndex].pos;
        
        // 呪いの効果（移動距離半減）
        let actualRollValue = rollValue;
        if (snapshot[playerIndex].curseTurns && snapshot[playerIndex].curseTurns! > 0) {
          actualRollValue = Math.max(1, Math.floor(rollValue / 2));
          snapshot[playerIndex].curseTurns! -= 1;
        }
        
        // 混乱の効果（逆方向移動の可能性）
        if (snapshot[playerIndex].confusionTurns && snapshot[playerIndex].confusionTurns! > 0) {
          if (Math.random() > 0.5) {
            actualRollValue = -actualRollValue;
          }
          snapshot[playerIndex].confusionTurns! -= 1;
        }
        
        // 1マスずつ移動を実行
        const moved = await movePlayerBy(snapshot, playerIndex, actualRollValue);
        
        const maybeWinner = checkGoal(moved);
        if (maybeWinner) {
          endGame(maybeWinner);
          resolve();
          return;
        }

        // 効果を適用
        const afterEffect = applySquareEffect(moved, playerIndex);
        setPlayers(afterEffect);

        const finalWinner = checkGoal(afterEffect);
        if (finalWinner) {
          endGame(finalWinner);
          resolve();
          return;
        }

        // 次のターンに進む
        setTimeout(() => {
          const nextIdx = (playerIndex + 1) % afterEffect.length;
          setCurrentPlayerIdx(nextIdx);
          setDiceDisabled(false);
          resolve();
        }, 2000); // ポップアップ表示時間を考慮
      } catch (error) {
        console.error('Turn processing error:', error);
        setDiceDisabled(false);
        resolve();
      }
    });
  }, [players, movePlayerBy, checkGoal, endGame, applySquareEffect]);

  const checkAndHandleRest = useCallback((playerIndex: number): boolean => {
    const player = players[playerIndex];
    if (player && player.restTurns && player.restTurns > 0) {
      // 休み中のエフェクトを表示
      setRestEffectState({
        show: true,
        playerName: player.name,
        restTurns: player.restTurns,
        restReason: player.restReason || '休憩中'
      });

      // プレイヤーの休み回数を減らす
      setPlayers(prevPlayers => {
        const newPlayers = prevPlayers.map(p => ({ ...p }));
        if (newPlayers[playerIndex].restTurns) {
          newPlayers[playerIndex].restTurns! -= 1;
          if (newPlayers[playerIndex].restTurns === 0) {
            newPlayers[playerIndex].restReason = '';
          }
        }
        return newPlayers;
      });

      // 2.5秒後にエフェクトを非表示にして次のプレイヤーのターンに
      setTimeout(() => {
        setRestEffectState({ show: false, playerName: '', restTurns: 0, restReason: '' });
        const nextIdx = (playerIndex + 1) % players.length;
        setCurrentPlayerIdx(nextIdx);
        setDiceDisabled(false);
      }, 2500);

      return true; // 休み処理を実行した
    }
    return false; // 通常のターン
  }, [players]);

  const handleRoll = useCallback(async () => {
    if (diceDisabled || gameEnded || !started) return;

    // 休み状態をチェック
    if (checkAndHandleRest(currentPlayerIdx)) {
      return; // 休み中の場合は処理終了
    }

    const rollValue = Math.floor(Math.random() * 6) + 1;
    const currentPlayerName = players[currentPlayerIdx]?.name || '';
    
    setDiceValue(rollValue);
    setDiceDisabled(true);
    setIsRolling(true);
    setLastEvent(null);

    setTimeout(async () => {
      setIsRolling(false);
      
      // サイコロ結果エフェクトを表示
      setDiceResultState({
        show: true,
        value: rollValue,
        playerName: currentPlayerName
      });

      // 1.5秒後にエフェクトを非表示にして移動開始
      setTimeout(async () => {
        setDiceResultState({ show: false, value: 0, playerName: '' });
        await processPlayerTurn(currentPlayerIdx, rollValue);
      }, 1500);
    }, 800);
  }, [diceDisabled, gameEnded, started, currentPlayerIdx, processPlayerTurn, players, checkAndHandleRest]);

  const handleReturn = useCallback(() => {
    setStarted(false);
    setPlayers([]);
    setCurrentPlayerIdx(0);
    setGameEnded(false);
    setWinner(null);
    setDiceDisabled(false);
    setLastEvent(null);
    setDiceValue(1);
    setIsRolling(false);
    setDiceResultState({ show: false, value: 0, playerName: '' });
    setRestEffectState({ show: false, playerName: '', restTurns: 0, restReason: '' });
    hideSquarePopup();
  }, [hideSquarePopup]);

  const handlePlayAgain = useCallback(() => {
    handleStart(isPCMode, difficulty);
  }, [handleStart, isPCMode, difficulty]);

  // PC Player turn handling
  useEffect(() => {
    if (!started || gameEnded || players.length === 0) return;
    
    const currentPlayer = players[currentPlayerIdx];
    if (!currentPlayer?.isPC || diceDisabled || popupState.show) return;

    const pcTurnTimeout = setTimeout(async () => {
      // PCプレイヤーの休み状態をチェック
      if (checkAndHandleRest(currentPlayerIdx)) {
        return; // 休み中の場合は処理終了
      }

      const pcRoll = Math.floor(Math.random() * 6) + 1;
      const currentPlayerName = players[currentPlayerIdx]?.name || '';
      
      setDiceValue(pcRoll);
      setDiceDisabled(true);
      setIsRolling(true);

      setTimeout(async () => {
        setIsRolling(false);
        
        // PCプレイヤーのサイコロ結果エフェクトを表示
        setDiceResultState({
          show: true,
          value: pcRoll,
          playerName: currentPlayerName
        });

        // 1.5秒後にエフェクトを非表示にして移動開始
        setTimeout(async () => {
          setDiceResultState({ show: false, value: 0, playerName: '' });
          await processPlayerTurn(currentPlayerIdx, pcRoll);
        }, 1500);
      }, 1200);
    }, 1500);

    return () => clearTimeout(pcTurnTimeout);
  }, [started, gameEnded, players, currentPlayerIdx, diceDisabled, processPlayerTurn, popupState.show, checkAndHandleRest]);

  const gameState: GameState = {
    players,
    currentPlayerIndex: currentPlayerIdx,
    isGameOver: gameEnded,
    winner,
    diceValue,
    isRolling,
    lastEvent,
    started,
  };

  return {
    gameState,
    popupState,
    diceResultState,
    restEffectState,
    demoSquares: demoSquares as Square[],
    difficulty,
    handleStart,
    handleRoll,
    handleReturn,
    handlePlayAgain,
    hideSquarePopup,
    resetGame: handleReturn,
  };
};
