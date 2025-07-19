'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const BOARD_SIZE = 400; // in pixels
const CELL_SIZE = BOARD_SIZE / GRID_SIZE;
const GAME_SPEED = 150; // in ms

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGamePage() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>(getRandomPosition());
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
      case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
      case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
      case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
    }
  }, [direction]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setIsRunning(true);
  };
  
  const startGame = () => {
    setIsRunning(true);
    resetGame();
  };

  const gameLoop = useCallback(() => {
    if (isGameOver || !isRunning) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      setIsRunning(false);
      return;
    }

    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        setIsGameOver(true);
        setIsRunning(false);
        return;
      }
    }

    newSnake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      setScore((s) => s + 1);
      setFood(getRandomPosition());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, isRunning]);

  useEffect(() => {
    if (isRunning) {
        window.addEventListener('keydown', handleKeyDown);
        gameLoopRef.current = setInterval(gameLoop, GAME_SPEED);
    }
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
    };
  }, [handleKeyDown, gameLoop, isRunning]);

  return (
    <div className="container mx-auto flex justify-center">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Snake Game</CardTitle>
          <CardDescription>Use arrow keys to control the snake. Eat the food to grow!</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-muted/30 rounded-lg border"
            style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
          >
            {!isRunning && !isGameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg">
                    <Button onClick={startGame} size="lg">Start Game</Button>
                </div>
            )}
            {isGameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg z-10">
                <p className="text-2xl font-bold text-white">Game Over</p>
                <p className="text-lg text-white mb-4">Your Score: {score}</p>
                <Button onClick={resetGame}>Play Again</Button>
              </div>
            )}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={cn("absolute rounded-sm", index === 0 ? "bg-primary" : "bg-primary/70")}
                style={{
                  left: `${segment.x * CELL_SIZE}px`,
                  top: `${segment.y * CELL_SIZE}px`,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            ))}
            <div
              className="absolute rounded-full bg-accent animate-pulse"
              style={{
                left: `${food.x * CELL_SIZE}px`,
                top: `${food.y * CELL_SIZE}px`,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <p className="text-lg font-semibold">Score: {score}</p>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Gamepad2 className="h-4 w-4"/>
                <span>Use Arrow Keys</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
