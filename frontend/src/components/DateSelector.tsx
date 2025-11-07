import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
}

const DateSelector = ({ date, onDateChange }: DateSelectorProps) => {
  return (
    <div className="card-shadow bg-card rounded-xl p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          📅 Selecione a data da previsão
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : "Escolha uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              locale={ptBR}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground">
          * Seleção de data preparada para futuras atualizações da API
        </p>
      </div>
    </div>
  );
};

export default DateSelector;
