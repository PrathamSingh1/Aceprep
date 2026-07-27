"use client";

import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';


export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    }
  }, [])

  const switchTheme = () => {
    switch (theme) {
      case 'light': {
        setTheme('dark');
        return;
      }
      case 'dark': {
        setTheme('light');
        return;
      }
      case 'system': {
        setTheme(systemTheme === 'light' ? 'dark' : 'light');
      }
    }
  }
  return (
    <button onClick={switchTheme} className='size-4 flex items-center justify-center relative'>
      <IconSun size={14} className='rotate-0 absolute inset-0 scale-100 transition-all duration-200 dark:rotate-90 dark:scale-0' />
      <IconMoon size={14} className='rotate-90 absolute inset-0 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100' />
    </button>
  )
}
