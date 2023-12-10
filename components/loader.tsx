import { Loader2 } from "lucide-react";

export default function Loader() {
  return <div className="flex items-center justify-center p-2">
    <Loader2 className="animate-spin" />
  </div>
}