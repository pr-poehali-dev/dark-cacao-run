import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { LeaderboardEntry, GameScreen } from './types';

interface LeaderboardScreenProps {
  leaderboard: LeaderboardEntry[];
  highScore: number;
  onNavigate: (screen: GameScreen) => void;
}

export default function LeaderboardScreen({ leaderboard, highScore, onNavigate }: LeaderboardScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C1810] to-[#1a0f0a] p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center">
          <Button
            onClick={() => onNavigate('menu')}
            variant="ghost"
            className="text-[#FFD700]"
          >
            <Icon name="ArrowLeft" size={24} />
            НАЗАД
          </Button>
        </div>

        <h1 className="text-4xl text-[#FFD700] text-center drop-shadow-[0_4px_0_#8B4513]">
          ТАБЛИЦА ЛИДЕРОВ
        </h1>

        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <Card
              key={index}
              className="p-4 bg-[#2C1810] border-4 border-[#8B4513] hover:border-[#FFD700] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 border-4 flex items-center justify-center text-2xl ${
                    index === 0 ? 'border-[#FFD700] bg-[#FFD700]/20' :
                    index === 1 ? 'border-[#C0C0C0] bg-[#C0C0C0]/20' :
                    index === 2 ? 'border-[#CD7F32] bg-[#CD7F32]/20' :
                    'border-[#8B4513] bg-[#8B4513]/20'
                  }`}>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <span className="text-xl text-[#FFD700]">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#D2691E] text-xl">
                  <Icon name="Star" size={20} />
                  <span>{entry.score.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {highScore > 0 && (
          <Card className="p-6 bg-[#4B0082] border-4 border-[#FFD700] text-center">
            <p className="text-[#FFD700] text-lg mb-2">Ваш лучший результат</p>
            <p className="text-3xl text-[#FFD700]">{highScore.toLocaleString()}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
