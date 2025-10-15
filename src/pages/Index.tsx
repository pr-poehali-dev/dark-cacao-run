import { useState, useEffect, useCallback } from 'react';
import MenuScreen from '@/components/game/MenuScreen';
import GameScreen from '@/components/game/GameScreen';
import ShopScreen from '@/components/game/ShopScreen';
import LeaderboardScreen from '@/components/game/LeaderboardScreen';
import BossScreen from '@/components/game/BossScreen';
import { GameScreen as GameScreenType, PowerUp, Obstacle } from '@/components/game/types';

export default function Index() {
  const [screen, setScreen] = useState<GameScreenType>('menu');
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
  const [bossHealth, setBossHealth] = useState(100);
  const [bossX, setBossX] = useState(600);
  const [bossAttacks, setBossAttacks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [playerHealth, setPlayerHealth] = useState(3);

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
    if (!isJumping && (isPlaying || screen === 'boss')) {
      setIsJumping(true);
      setVelocity(15);
    }
  }, [isJumping, isPlaying, screen]);

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

      if (distance >= 3000 && screen === 'game') {
        setIsPlaying(false);
        setScreen('boss');
        setBossHealth(100);
        setPlayerHealth(3);
        setBossX(600);
        setBossAttacks([]);
        return;
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
  }, [isPlaying, velocity, isJumping, obstacles, gameSpeed, distance, score, highScore, screen]);

  useEffect(() => {
    if (screen !== 'boss' || bossHealth === 0 || playerHealth === 0) return;

    const bossLoop = setInterval(() => {
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

      setBossAttacks(prev => {
        const updated = prev
          .map(att => ({ ...att, x: att.x - 8 }))
          .filter(att => att.x > -50);

        if (Math.random() < 0.03) {
          updated.push({
            id: Date.now(),
            x: bossX - 50,
            y: Math.random() * 400 + 100
          });
        }

        const hit = updated.some(att => {
          const playerHitbox = { x: 100, y: window.innerHeight - 120 - playerY, width: 64, height: 64 };
          const attackHitbox = { x: att.x, y: att.y, width: 32, height: 32 };
          return (
            playerHitbox.x < attackHitbox.x + attackHitbox.width &&
            playerHitbox.x + playerHitbox.width > attackHitbox.x &&
            playerHitbox.y < attackHitbox.y + attackHitbox.height &&
            playerHitbox.y + playerHitbox.height > attackHitbox.y
          );
        });

        if (hit) {
          setPlayerHealth(h => Math.max(0, h - 1));
          return updated.filter(att => {
            const playerHitbox = { x: 100, y: window.innerHeight - 120 - playerY, width: 64, height: 64 };
            const attackHitbox = { x: att.x, y: att.y, width: 32, height: 32 };
            return !(
              playerHitbox.x < attackHitbox.x + attackHitbox.width &&
              playerHitbox.x + playerHitbox.width > attackHitbox.x &&
              playerHitbox.y < attackHitbox.y + attackHitbox.height &&
              playerHitbox.y + playerHitbox.height > attackHitbox.y
            );
          });
        }

        return updated;
      });

      setBossX(prev => {
        const target = 600 + Math.sin(Date.now() / 1000) * 100;
        return prev + (target - prev) * 0.05;
      });
    }, 1000 / 60);

    return () => clearInterval(bossLoop);
  }, [screen, bossHealth, playerHealth, bossX, velocity, isJumping, playerY]);

  const startGame = () => {
    setScore(0);
    setDistance(0);
    setPlayerY(0);
    setVelocity(0);
    setIsJumping(false);
    setObstacles([]);
    setGameSpeed(5);
    setIsPlaying(true);
    setPlayerHealth(3);
    setScreen('game');
  };

  const attackBoss = () => {
    if (screen !== 'boss') return;
    setBossHealth(prev => {
      const newHealth = Math.max(0, prev - 10);
      if (newHealth === 0) {
        const bossBonus = 1000;
        setCoins(c => c + 50);
        setScore(s => s + bossBonus);
        if (score + bossBonus > highScore) {
          setHighScore(score + bossBonus);
        }
        setTimeout(() => setScreen('menu'), 3000);
      }
      return newHealth;
    });
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

  const handleBackToMenu = () => {
    setIsPlaying(false);
    setScreen('menu');
  };

  if (screen === 'menu') {
    return (
      <MenuScreen
        coins={coins}
        highScore={highScore}
        onStartGame={startGame}
        onNavigate={setScreen}
      />
    );
  }

  if (screen === 'game') {
    return (
      <GameScreen
        score={score}
        coins={coins}
        highScore={highScore}
        playerY={playerY}
        obstacles={obstacles}
        isPlaying={isPlaying}
        onJump={jump}
        onStartGame={startGame}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  if (screen === 'shop') {
    return (
      <ShopScreen
        coins={coins}
        powerUps={powerUps}
        onUpgrade={upgradePowerUp}
        onNavigate={setScreen}
      />
    );
  }

  if (screen === 'leaderboard') {
    return (
      <LeaderboardScreen
        leaderboard={leaderboard}
        highScore={highScore}
        onNavigate={setScreen}
      />
    );
  }

  if (screen === 'boss') {
    return (
      <BossScreen
        bossHealth={bossHealth}
        playerHealth={playerHealth}
        playerY={playerY}
        bossX={bossX}
        bossAttacks={bossAttacks}
        score={score}
        onAttackBoss={attackBoss}
        onStartGame={startGame}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return null;
}
