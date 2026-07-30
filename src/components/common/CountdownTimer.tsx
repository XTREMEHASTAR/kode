import React from 'react';
import { AiChipCountdownTimer } from './AiChipCountdownTimer';

interface CountdownTimerProps {
  targetDate: string; // ISO string
  onReachZero?: () => void;
  onClick?: () => void;
  theme?: 'off-white' | 'dark-cyber' | 'nothing-glass' | 'stripe-neon';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onReachZero,
  onClick,
  theme = 'off-white'
}) => {
  const mappedTheme = theme === 'dark-cyber' ? 'dark-cyber' : 'off-white';

  return (
    <AiChipCountdownTimer
      targetDate={targetDate}
      onReachZero={onReachZero}
      onClick={onClick}
      theme={mappedTheme}
    />
  );
};
