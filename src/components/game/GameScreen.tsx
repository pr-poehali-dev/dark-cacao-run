import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Obstacle } from './types';

interface GameScreenProps {
  score: number;
  coins: number;
  highScore: number;
  playerY: number;
  obstacles: Obstacle[];
  isPlaying: boolean;
  onJump: () => void;
  onStartGame: () => void;
  onBackToMenu: () => void;
}

export default function GameScreen({
  score,
  coins,
  highScore,
  playerY,
  obstacles,
  isPlaying,
  onJump,
  onStartGame,
  onBackToMenu
}: GameScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C1810] to-[#1a0f0a] flex flex-col">
      <div className="p-4 flex justify-between items-center border-b-4 border-[#8B4513]">
        <Button
          onClick={onBackToMenu}
          variant="ghost"
          className="text-[#FFD700]"
        >
          <Icon name="ArrowLeft" size={24} />
        </Button>

        <div className="flex gap-6 text-[#FFD700] text-xl">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={20} />
            <span>{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Coins" size={20} />
            <span>{coins}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden" onClick={onJump}>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B4513]"></div>

        <div
          className="absolute bottom-1 w-12 h-12 bg-[#8B4513] border-4 border-[#FFD700] transition-all duration-100"
          style={{
            left: '100px',
            transform: `translateY(-${playerY}px)`
          }}
        >
          <div className="absolute inset-1 bg-[#D2691E]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
            🍪
          </div>
        </div>

        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="absolute bottom-1 w-10 h-10 bg-[#4B0082] border-4 border-[#8B00FF]"
            style={{ left: `${obs.x}px` }}
          >
            <div className="absolute inset-1 bg-[#6A0DAD]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
              {obs.type === 'spike' && '⚡'}
              {obs.type === 'pit' && '🕳️'}
              {obs.type === 'enemy' && '👾'}
            </div>
          </div>
        ))}

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Card className="p-8 text-center space-y-6 bg-[#2C1810] border-4 border-[#FFD700]">
              <h2 className="text-3xl text-[#FFD700]">ИГРА ОКОНЧЕНА</h2>
              <div className="space-y-2 text-[#D2691E] text-xl">
                <p>Счёт: {score}</p>
                <p>Рекорд: {highScore}</p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={onStartGame}
                  className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-[#FFD700] border-4 border-[#FFD700]"
                >
                  ЕЩЁ РАЗ
                </Button>
                <Button
                  onClick={onBackToMenu}
                  className="w-full bg-[#4B0082] hover:bg-[#5B1092] text-[#FFD700] border-4 border-[#FFD700]"
                >
                  МЕНЮ
                </Button>
              </div>
            </Card>
          </div>
        )}

        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#FFD700] text-sm opacity-70">
          НАЖМИТЕ ПРОБЕЛ ИЛИ ЭКРАН ДЛЯ ПРЫЖКА
        </div>
      </div>
    </div>
  );
}
