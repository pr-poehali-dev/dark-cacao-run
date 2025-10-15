import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { PowerUp, GameScreen } from './types';

interface ShopScreenProps {
  coins: number;
  powerUps: PowerUp[];
  onUpgrade: (id: string) => void;
  onNavigate: (screen: GameScreen) => void;
}

export default function ShopScreen({ coins, powerUps, onUpgrade, onNavigate }: ShopScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C1810] to-[#1a0f0a] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate('menu')}
            variant="ghost"
            className="text-[#FFD700]"
          >
            <Icon name="ArrowLeft" size={24} />
            НАЗАД
          </Button>

          <div className="flex items-center gap-2 text-[#FFD700] text-2xl">
            <Icon name="Coins" size={28} />
            <span>{coins}</span>
          </div>
        </div>

        <h1 className="text-4xl text-[#FFD700] text-center drop-shadow-[0_4px_0_#8B4513]">
          МАГАЗИН
        </h1>

        <div className="grid gap-4">
          {powerUps.map(pu => (
            <Card
              key={pu.id}
              className="p-6 bg-[#2C1810] border-4 border-[#8B4513] hover:border-[#FFD700] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#8B4513] border-4 border-[#D2691E] flex items-center justify-center text-2xl">
                      {pu.id === 'speed' && '🍪'}
                      {pu.id === 'shield' && '🛡️'}
                      {pu.id === 'magnet' && '🧲'}
                    </div>
                    <div>
                      <h3 className="text-xl text-[#FFD700]">{pu.name}</h3>
                      <p className="text-sm text-[#D2691E]">{pu.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[#FFD700]">
                      <span>Уровень {pu.level}/{pu.maxLevel}</span>
                      <span className="flex items-center gap-1">
                        <Icon name="Coins" size={16} />
                        {pu.cost}
                      </span>
                    </div>
                    <Progress value={(pu.level / pu.maxLevel) * 100} className="h-2" />
                  </div>
                </div>

                <Button
                  onClick={() => onUpgrade(pu.id)}
                  disabled={pu.level >= pu.maxLevel || coins < pu.cost}
                  className="bg-[#D2691E] hover:bg-[#E67E30] text-[#2C1810] border-4 border-[#FFD700] disabled:opacity-50"
                >
                  УЛУЧШИТЬ
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
