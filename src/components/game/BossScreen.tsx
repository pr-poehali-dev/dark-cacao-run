import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { BossAttack } from './types';

interface BossScreenProps {
  bossHealth: number;
  playerHealth: number;
  playerY: number;
  bossX: number;
  bossAttacks: BossAttack[];
  score: number;
  onAttackBoss: () => void;
  onStartGame: () => void;
  onBackToMenu: () => void;
}

export default function BossScreen({
  bossHealth,
  playerHealth,
  playerY,
  bossX,
  bossAttacks,
  score,
  onAttackBoss,
  onStartGame,
  onBackToMenu
}: BossScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f0a] to-[#4B0082] flex flex-col">
      <div className="p-4 border-b-4 border-[#8B00FF]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-[#8B00FF]">
                <Icon name="Skull" size={24} />
                <span className="text-xl">Shadow Milk</span>
              </div>
              <Progress value={bossHealth} className="h-4 bg-[#2C1810]" />
              <div className="text-sm text-[#FFD700]">{bossHealth}/100 HP</div>
            </div>

            <div className="ml-8 space-y-2">
              <div className="flex items-center gap-2 text-[#FFD700]">
                <Icon name="Heart" size={24} />
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 border-4 ${
                        i < playerHealth
                          ? 'bg-[#FF0000] border-[#FFD700]'
                          : 'bg-[#2C1810] border-[#8B4513]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-[#D2691E]">Счёт: {score}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden" onClick={onAttackBoss}>
        <div
          className="absolute w-32 h-32 bg-[#4B0082] border-8 border-[#8B00FF] transition-all duration-300 animate-[float_3s_ease-in-out_infinite]"
          style={{
            right: `${800 - bossX}px`,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <div className="absolute inset-2 bg-[#6A0DAD]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl">
            👾
          </div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-pulse">
            👿
          </div>
        </div>

        <div
          className="absolute bottom-20 w-16 h-16 bg-[#8B4513] border-4 border-[#FFD700] transition-all duration-100"
          style={{
            left: '100px',
            transform: `translateY(-${playerY}px)`
          }}
        >
          <div className="absolute inset-1 bg-[#D2691E]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
            🍪
          </div>
        </div>

        {bossAttacks.map(attack => (
          <div
            key={attack.id}
            className="absolute w-8 h-8 bg-[#8B00FF] border-4 border-[#FFD700] animate-pulse"
            style={{
              left: `${attack.x}px`,
              top: `${attack.y}px`
            }}
          >
            <div className="absolute inset-1 bg-[#6A0DAD]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg">
              ⚡
            </div>
          </div>
        ))}

        {bossHealth === 0 && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Card className="p-8 text-center space-y-6 bg-[#2C1810] border-4 border-[#FFD700] animate-scale-in">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-4xl text-[#FFD700]">ПОБЕДА!</h2>
              <div className="space-y-2 text-[#D2691E] text-xl">
                <p>Shadow Milk побеждён!</p>
                <p>Счёт: {score}</p>
                <p>Бонус: +1000</p>
                <p className="text-[#FFD700] text-2xl">Награда: +50 монет</p>
              </div>
              <p className="text-sm text-[#8B4513]">Возврат в меню...</p>
            </Card>
          </div>
        )}

        {playerHealth === 0 && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Card className="p-8 text-center space-y-6 bg-[#2C1810] border-4 border-[#FFD700]">
              <h2 className="text-3xl text-[#8B00FF]">ПОРАЖЕНИЕ</h2>
              <div className="space-y-2 text-[#D2691E] text-xl">
                <p>Shadow Milk оказался сильнее</p>
                <p>Счёт: {score}</p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={onStartGame}
                  className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-[#FFD700] border-4 border-[#FFD700]"
                >
                  ПОПРОБОВАТЬ СНОВА
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

        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#FFD700] text-sm opacity-70 text-center">
          <p>НАЖИМАЙ НА БОССА ЧТОБЫ АТАКОВАТЬ!</p>
          <p className="text-xs mt-1">Уворачивайся от атак прыжками</p>
        </div>
      </div>
    </div>
  );
}
