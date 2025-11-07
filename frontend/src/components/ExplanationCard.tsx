import React from "react";

interface Props {
  explanation: string;
  isLoading: boolean;
}

const ExplanationCard: React.FC<Props> = ({ explanation, isLoading }) => {
  
  // ✅ Função de leitura em voz alta
  const speakText = () => {
    if (!explanation) return;

    // Para evitar sobreposição de vozes
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(explanation);
    utterance.lang = "pt-BR"; // ✅ voz brasileira
    utterance.rate = 1.0;     // velocidade natural
    utterance.pitch = 1.0;    // tom natural
    
    window.speechSynthesis.speak(utterance);
  };

  // ✅ Função para parar a leitura
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border p-4">
        <p className="text-muted-foreground">Gerando explicação...</p>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="rounded-2xl border border-border p-4 flex flex-col gap-3">
      <h3 className="text-lg font-semibold">📘 Explicação Personalizada</h3>

      <p className="whitespace-pre-line text-sm leading-relaxed">
        {explanation}
      </p>

      {/* ✅ Botões de Acessibilidade */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={speakText}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          🔊 Ouvir explicação
        </button>

        <button
          onClick={stopSpeaking}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
        >
          ⏹️ Parar
        </button>
      </div>
    </div>
  );
};

export default ExplanationCard;
