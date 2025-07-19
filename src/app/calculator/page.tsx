'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const buttonClasses = "h-16 text-xl font-semibold rounded-lg transition-colors duration-200";
const operatorClasses = "bg-accent/20 hover:bg-accent/40 text-accent";
const functionClasses = "bg-secondary hover:bg-muted";

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleInput = (value: string) => {
    if (isGameOver()) return;
    if (display === '0' && value !== '.') {
      setDisplay(value);
      setExpression(value);
    } else {
      setDisplay(display + value);
      setExpression(expression + value);
    }
  };

  const handleOperator = (op: string) => {
    if (isGameOver()) return;
    const lastChar = expression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        setExpression(expression.slice(0, -1) + op);
    } else {
        setExpression(expression + op);
    }
    setDisplay(op);
  };
  
  const isGameOver = () => display === 'Error' || display === 'Infinity';

  const calculate = () => {
    if (isGameOver()) return;
    try {
      // Unsafe eval is used for simplicity in this demonstration.
      // For a production app, a safe evaluation library like math.js should be used.
      const result = eval(expression.replace(/--/g, '+'));
      setDisplay(String(result));
      setExpression(String(result));
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleFunction = (func: string) => {
    if(isGameOver()) return;
    try {
        const currentVal = parseFloat(eval(expression));
        let result;
        switch(func) {
            case 'sqrt': result = Math.sqrt(currentVal); break;
            case 'sin': result = Math.sin(currentVal * Math.PI / 180); break;
            case 'cos': result = Math.cos(currentVal * Math.PI / 180); break;
            case 'tan': result = Math.tan(currentVal * Math.PI / 180); break;
            case 'log': result = Math.log10(currentVal); break;
            case 'ln': result = Math.log(currentVal); break;
            default: result = currentVal;
        }
        const finalResult = Number(result.toFixed(10));
        setDisplay(String(finalResult));
        setExpression(String(finalResult));
    } catch(e) {
        setDisplay('Error');
        setExpression('');
    }
  }


  return (
    <div className="container mx-auto flex justify-center">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Scientific Calculator</CardTitle>
          <div className="h-20 bg-muted/50 rounded-lg mt-4 p-4 flex items-center justify-end">
            <p className="text-4xl font-code font-bold text-right truncate" title={display}>{display}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {/* Scientific Functions */}
            <Button className={`${buttonClasses} ${functionClasses}`} onClick={() => handleFunction('sin')}>sin</Button>
            <Button className={`${buttonClasses} ${functionClasses}`} onClick={() => handleFunction('cos')}>cos</Button>
            <Button className={`${buttonClasses} ${functionClasses}`} onClick={() => handleFunction('tan')}>tan</Button>
            <Button className={`${buttonClasses} ${functionClasses}`} onClick={() => handleFunction('log')}>log</Button>
            <Button className={`${buttonClasses} ${operatorClasses}`} onClick={() => handleOperator('/')}>/</Button>
            
            <Button className={`${buttonClasses} ${functionClasses}`} onClick={() => handleFunction('ln')}>ln</Button>
            <Button className={`${buttonClasses} ${functionClasses}`} onClick={() => setExpression(expression + '(')}>(</Button>
            <Button className={`${buttonClasses} ${functionClasses}`} onClick={() => setExpression(expression + ')')}>)</Button>
            <Button className={`${buttonClasses} ${functionClasses}`} onClick={() => handleFunction('sqrt')}>√</Button>
            <Button className={`${buttonClasses} ${operatorClasses}`} onClick={() => handleOperator('*')}>*</Button>
            
            {/* Number Pad */}
            <Button className={buttonClasses} onClick={() => handleInput('7')}>7</Button>
            <Button className={buttonClasses} onClick={() => handleInput('8')}>8</Button>
            <Button className={buttonClasses} onClick={() => handleInput('9')}>9</Button>
            <Button className={`${buttonClasses} text-destructive/80 hover:bg-destructive/10 col-span-2`} onClick={clear}>C</Button>
            
            <Button className={buttonClasses} onClick={() => handleInput('4')}>4</Button>
            <Button className={buttonClasses} onClick={() => handleInput('5')}>5</Button>
            <Button className={buttonClasses} onClick={() => handleInput('6')}>6</Button>
            <Button className={`${buttonClasses} ${operatorClasses}`} onClick={() => handleOperator('-')}>-</Button>
            <Button className={`${buttonClasses} ${operatorClasses}`} onClick={() => handleOperator('+')}>+</Button>

            <Button className={buttonClasses} onClick={() => handleInput('1')}>1</Button>
            <Button className={buttonClasses} onClick={() => handleInput('2')}>2</Button>
            <Button className={buttonClasses} onClick={() => handleInput('3')}>3</Button>
            <Button className={`${buttonClasses} bg-primary hover:bg-primary/90 text-primary-foreground row-span-2`} onClick={calculate}>=</Button>
            
            <Button className={`${buttonClasses} col-span-2`} onClick={() => handleInput('0')}>0</Button>
            <Button className={buttonClasses} onClick={() => handleInput('.')}>.</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
