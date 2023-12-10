'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/utils/blink';
import { useSWRConfig } from 'swr';
import Loader from './loader';
import { useToast } from './ui/use-toast';

export default function LogoutDialog({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);

    try {
      await api.post('/api/auth/logout');

      setLoading(false);
      toast({
        title: 'Пока!',
        description: `Вы вышли из аккаунта`,
      });

      setDialogOpen(false);
      mutate('/api/auth/user');

    } catch (error) {
      setLoading(false);
      toast({
        title: 'Не удалось выполнить выход',
        description: 'Попробуйте еще раз, если не получится - почистите куки',
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Выход из аккаунта</DialogTitle>
          <DialogDescription>Вы действительно хотите выйти из аккаунта?</DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2'>
          <Button onClick={() => { setDialogOpen(false); }}>
            Отмена
          </Button>
          
          <Button onClick={handleSignOut} disabled={loading} variant={'destructive'} type="submit">
            {loading ? <Loader /> : 'Да, хочу'}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
