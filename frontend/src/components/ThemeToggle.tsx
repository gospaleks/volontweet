import { HugeiconsIcon } from '@hugeicons/react';
import {
  ComputerIcon,
  Moon02Icon,
  PaintBoardIcon,
  SunIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';

import { useTheme } from '@/hooks/useTheme';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            <HugeiconsIcon
              icon={SunIcon}
              className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
            <HugeiconsIcon
              icon={Moon02Icon}
              className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ThemeMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ThemeDropdownMenuItem = () => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <HugeiconsIcon icon={PaintBoardIcon} />
        Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent align="end">
          <ThemeMenuItems />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

const ThemeMenuItems = () => {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <DropdownMenuItem onClick={() => setTheme('light')}>
        <HugeiconsIcon icon={SunIcon} />
        Light
        {theme === 'light' && (
          <HugeiconsIcon icon={Tick02Icon} className="ml-auto" />
        )}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>
        <HugeiconsIcon icon={Moon02Icon} />
        Dark
        {theme === 'dark' && (
          <HugeiconsIcon icon={Tick02Icon} className="ml-auto" />
        )}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>
        <HugeiconsIcon icon={ComputerIcon} />
        System
        {theme === 'system' && (
          <HugeiconsIcon icon={Tick02Icon} className="ml-auto" />
        )}
      </DropdownMenuItem>
    </>
  );
};
