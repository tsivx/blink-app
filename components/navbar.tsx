'use client';

import { useUser } from '@/hooks/useUser';
import { ArrowLeft, GraduationCap, LogIn, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import LoginDialog from './login-dialog';
import LogoutDialog from './logout-dialog';
import { ThemeToggle } from './theme';
import { Button } from './ui/button';

export function Navbar() {
  const { user } = useUser();

  const pathname = usePathname();
  const router = useRouter();

  const goBack = () => {
    if (window.history.state && window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <header className="flex items-center gap-2 font-medium justify-between py-2">
      <div className="brand flex items-center gap-2 ">
        {pathname !== '/' && (
          <div className="back-button flex gap-2 items-center">
            <Button onClick={goBack} size={'icon'} variant={'ghost'}>
              <ArrowLeft />
            </Button>
          </div>
        )}

        <div className="logo flex items-center gap-2">
          <GraduationCap />
          <div className="title text-lg">Blink: Расписание</div>
        </div>
      </div>

      <div className="actions flex items-center gap-2">
        <ThemeToggle />

        {user ? (
          <LogoutDialog>
            <Button variant="ghost" size="icon">
              <LogOut className='h-5 w-5' />
            </Button>
          </LogoutDialog>
        ) : (
          <LoginDialog>
            <Button variant="ghost" size="icon">
              <LogIn className='h-5 w-5' />
            </Button>
          </LoginDialog>
        )}
      </div>
    </header>
  );
}
