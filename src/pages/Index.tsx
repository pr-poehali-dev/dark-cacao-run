import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

type GameScreen = 'menu' | 'game' | 'shop' | 'leaderboard';

interface PowerUp {
  id: string;
  name: string;
  cost: number;
  level: number;
  maxLevel: number;
  description: string;
}

interface Obstacle {
  id: number;
  x: number;
  type: 'spike' | 'pit' | 'enemy';
}

export default function Index() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameSpeed, setGameSpeed] = useState(5);
  const [distance, setDistance] = useState(0);

  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    { id: 'speed', name: 'Dark Cacao', description: 'Крепер', cost: 13, level: 0, maxLevel: 5 },
    { id: 'shield', name: 'Щит', description: 'Защита от препятствий', cost: 50, level: 0, maxLevel: 3 },
    { id: 'magnet', name: 'Магнит', description: 'Притягивает монеты', cost: 100, level: 0, maxLevel: 3 },
  ]);

  const [leaderboard] = useState([
    { name: 'Player 1', score: 15420 },
    { name: 'Player 2', score: 12350 },
    { name: 'Player 3', score: 10200 },
    { name: 'Player 4', score: 8500 },
    { name: 'Player 5', score: 6300 },
  ]);

  const jump = useCallback(() => {
    if (!isJumping && isPlaying) {
      setIsJumping(true);
      setVelocity(15);
    }
  }, [isJumping, isPlaying]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      setPlayerY(prev => {
        const newY = prev - velocity;
        if (newY >= 0) {
          setIsJumping(false);
          setVelocity(0);
          return 0;
        }
        return newY;
      });

      if (isJumping) {
        setVelocity(prev => prev - 1);
      }

      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, x: obs.x - gameSpeed }))
          .filter(obs => obs.x > -100);

        if (Math.random() < 0.02) {
          const types: ('spike' | 'pit' | 'enemy')[] = ['spike', 'pit', 'enemy'];
          updated.push({
            id: Date.now(),
            x: 800,
            type: types[Math.floor(Math.random() * types.length)]
          });
        }

        return updated;
      });

      setDistance(prev => prev + 1);
      setScore(prev => prev + 1);

      if (distance % 500 === 0 && distance > 0) {
        setGameSpeed(prev => Math.min(prev + 0.5, 15));
      }

      if (distance % 100 === 0) {
        setCoins(prev => prev + 1);
      }

      const collision = obstacles.some(obs => {
        const playerHitbox = { x: 100, y: 300 - playerY, width: 40, height: 40 };
        const obsHitbox = { x: obs.x, y: 300, width: 40, height: 40 };
        return (
          playerHitbox.x < obsHitbox.x + obsHitbox.width &&
          playerHitbox.x + playerHitbox.width > obsHitbox.x &&
          playerHitbox.y < obsHitbox.y + obsHitbox.height &&
          playerHitbox.y + playerHitbox.height > obsHitbox.y
        );
      });

      if (collision) {
        setIsPlaying(false);
        if (score > highScore) {
          setHighScore(score);
        }
      }
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [isPlaying, velocity, isJumping, obstacles, gameSpeed, distance, score, highScore]);

  const startGame = () => {
    setScore(0);
    setDistance(0);
    setPlayerY(0);
    setVelocity(0);
    setIsJumping(false);
    setObstacles([]);
    setGameSpeed(5);
    setIsPlaying(true);
    setScreen('game');
  };

  const upgradePowerUp = (id: string) => {
    setPowerUps(prev => prev.map(pu => {
      if (pu.id === id && pu.level < pu.maxLevel && coins >= pu.cost) {
        setCoins(c => c - pu.cost);
        return { ...pu, level: pu.level + 1, cost: Math.floor(pu.cost * 1.5) };
      }
      return pu;
    }));
  };

  if (screen === 'menu') {
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
              onClick={startGame}
              className="w-full max-w-md bg-[#8B4513] hover:bg-[#A0522D] text-[#FFD700] border-4 border-[#FFD700] h-16 text-xl"
            >
              <Icon name="Play" className="mr-2" size={24} />
              ИГРАТЬ
            </Button>

            <Button
              onClick={() => setScreen('shop')}
              className="w-full max-w-md bg-[#D2691E] hover:bg-[#E67E30] text-[#2C1810] border-4 border-[#FFD700] h-16 text-xl"
            >
              <Icon name="ShoppingBag" className="mr-2" size={24} />
              МАГАЗИН
            </Button>

            <Button
              onClick={() => setScreen('leaderboard')}
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

  if (screen === 'game') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2C1810] to-[#1a0f0a] flex flex-col">
        <div className="p-4 flex justify-between items-center border-b-4 border-[#8B4513]">
          <Button
            onClick={() => {
              setIsPlaying(false);
              setScreen('menu');
            }}
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

        <div className="flex-1 relative overflow-hidden" onClick={jump}>
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
                    onClick={startGame}
                    className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-[#FFD700] border-4 border-[#FFD700]"
                  >
                    ЕЩЁ РАЗ
                  </Button>
                  <Button
                    onClick={() => setScreen('menu')}
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

  if (screen === 'shop') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2C1810] to-[#1a0f0a] p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setScreen('menu')}
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
                    onClick={() => upgradePowerUp(pu.id)}
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

  if (screen === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2C1810] to-[#1a0f0a] p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center">
            <Button
              onClick={() => setScreen('menu')}
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

  return null;
}
