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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

import { api } from '@/utils/blink';
import { useSWRConfig } from 'swr';
import Loader from './loader';
import { useToast } from './ui/use-toast';

export default function LoginDialog({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/login', {
        email,
        password,
      });

      setLoading(false);
      toast({
        title: `Привет, ${data.name}!`,
      });

      setDialogOpen(false);
      mutate('/api/auth/user');
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Не удалось выполнить вход',
        description: 'Неправильный логин или пароль',
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Авторизация</DialogTitle>
          <DialogDescription>Вход в аккаунт диспетчера расписания</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Почта</Label>
            <Input
              onChange={({ target }) => {
                setEmail(target.value);
              }}
              type="email"
              required
              value={email}
              id="email"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              onChange={({ target }) => {
                setPassword(target.value);
              }}
              value={password}
              id="password"
              type="password"
              required
              placeholder="Введите пароль"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSignIn} disabled={loading} type="submit">
            {loading ? <Loader /> : 'Войти'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
