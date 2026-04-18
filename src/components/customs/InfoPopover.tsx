import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface InfoPopoverProps {
  title: string;
  content: React.ReactNode;
}

export const InfoPopover = ({ title, content }: InfoPopoverProps) => (
  <Popover>
    <PopoverTrigger className="inline-flex items-center justify-center rounded-full h-6 w-6 text-primary hover:bg-primary/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50">
      <Info className="h-4 w-4" />
    </PopoverTrigger>
    
    <PopoverContent side="top" className="w-80 shadow-lg">
      <div className="space-y-2">
        <h4 className="font-semibold leading-none text-foreground">{title}</h4>
        <div className="text-sm text-muted-foreground leading-relaxed">{content}</div>
      </div>
    </PopoverContent>
  </Popover>
);