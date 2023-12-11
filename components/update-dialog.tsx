"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database } from "@/types/supabase";
import { api } from "@/utils/blink";
import { useState } from "react";
import { useSWRConfig } from "swr";
import Loader from "./loader";
import { useToast } from "./ui/use-toast";


type College = Database['public']['Tables']['colleges']['Row']

export default function UpdateScheduleDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mutate } = useSWRConfig();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [timetable, setTimetable] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = () => {
    if (!timetable) return;

    setLoading(true);

    const reader = new FileReader();
    reader.readAsText(timetable, "UTF-8");

    reader.onload = async ({ target }) => {
      try {
        await api.post('/api/update', target?.result);

        setLoading(false);
        toast({
          title: "Расписание успешно обновлено!",
        });

        mutate('/api/profiles');
        mutate('/api/profiles/pinned');
        setDialogOpen(false);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Не удалось прочитать файл",
          description: "JSON: Не удалось декодировать файл",
        });
      }
    };

    reader.onerror = () => {
      setLoading(false);
      toast({
        title: "Не удалось прочитать файл",
        description: "FileReader: Произошла ошибка при чтении файла",
      });
    };
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Обновление расписания</DialogTitle>
          <DialogDescription>
            Загрузите файл с расширением .json экспортированный с программы
            AVTOR
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
            <Label htmlFor="timetable">Файл расписания</Label>
            <Input
              onChange={({ target }) => {
                setTimetable(target.files![0]);
              }}
              type="file"
              accept="application/json"
              required
              id="timetable"
            />
          </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading} type="submit">
            {loading ? <Loader /> : "Обновить расписание"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
