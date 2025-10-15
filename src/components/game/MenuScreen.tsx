import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { GameScreen } from './types';

interface MenuScreenProps {
  coins: number;
  highScore: number;
  onStartGame: () => void;
  onNavigate: (screen: GameScreen) => void;
}

export default function MenuScreen({ coins, highScore, onStartGame, onNavigate }: MenuScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C1810] to-[#1a0f0a] flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl w-full">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl text-[#FFD700] drop-shadow-[0_4px_0_#8B4513] animate-pulse">
            DARK CACAO
          </h1>
          <h2 className="text-2xl md:text-3xl text-[#D2691E] drop-shadow-[0_2px_0_#2C1810]">
            RUNNER
          </h2>
        </div>

        <div className="flex justify-center">
          <div className="w-32 h-32 bg-[#8B4513] border-4 border-[#FFD700] relative animate-[bounce_2s_ease-in-out_infinite]">
            <div className="absolute inset-2 bg-[#D2691E]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
              🍪
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onStartGame}
            className="w-full max-w-md bg-[#8B4513] hover:bg-[#A0522D] text-[#FFD700] border-4 border-[#FFD700] h-16 text-xl"
          >
            <Icon name="Play" className="mr-2" size={24} />
            ИГРАТЬ
          </Button>

          <Button
            onClick={() => onNavigate('shop')}
            className="w-full max-w-md bg-[#D2691E] hover:bg-[#E67E30] text-[#2C1810] border-4 border-[#FFD700] h-16 text-xl"
          >
            <Icon name="ShoppingBag" className="mr-2" size={24} />
            МАГАЗИН
          </Button>

          <Button
            onClick={() => onNavigate('leaderboard')}
            className="w-full max-w-md bg-[#4B0082] hover:bg-[#5B1092] text-[#FFD700] border-4 border-[#FFD700] h-16 text-xl"
          >
            <Icon name="Trophy" className="mr-2" size={24} />
            РЕКОРДЫ
          </Button>
        </div>

        <div className="flex justify-center gap-8 text-[#FFD700]">
          <div className="flex items-center gap-2">
            <Icon name="Coins" size={20} />
            <span className="text-lg">{coins}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Star" size={20} />
            <span className="text-lg">{highScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
