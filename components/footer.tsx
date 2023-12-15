import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <div className="w-full text-center text-xs text-muted-foreground p-2 items-center flex justify-center gap-1">
      made with <Heart className="h-4 w-4" /> by @tsivxrev
    </div>
  );
}
