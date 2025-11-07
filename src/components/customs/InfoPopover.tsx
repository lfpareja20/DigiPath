import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface InfoPopoverProps {
  title: string;
  content: React.ReactNode;
}

export const InfoPopover = ({ title, content }: InfoPopoverProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:bg-transparent">
        <Info className="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <div className="text-sm text-muted-foreground space-y-2">{content}</div>
    </PopoverContent>
  </Popover>
);