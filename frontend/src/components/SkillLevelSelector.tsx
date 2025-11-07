import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SkillLevelSelectorProps {
  level: string;
  onLevelChange: (level: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const SkillLevelSelector = ({ level, onLevelChange, onGenerate, isLoading }: SkillLevelSelectorProps) => {
  return (
    <div className="card-shadow bg-card rounded-xl p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          🏄 Selecione seu nível de surf
        </label>
        <Select value={level} onValueChange={onLevelChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Escolha seu nível" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="iniciante">Iniciante</SelectItem>
            <SelectItem value="intermediario">Intermediário</SelectItem>
            <SelectItem value="avancado">Avançado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        onClick={onGenerate}
        disabled={isLoading || !level}
        className="w-full ocean-gradient hover:opacity-90 transition-opacity"
        size="lg"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        {isLoading ? "Gerando..." : "Gerar Explicação"}
      </Button>
    </div>
  );
};

export default SkillLevelSelector;
