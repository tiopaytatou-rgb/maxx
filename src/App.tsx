import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeHero } from './components/WelcomeHero';
import { ChatMessage, Message } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TestGuideModal } from './components/TestGuideModal';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isTestGuideOpen, setIsTestGuideOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize SpeechSynthesis on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Scroll to bottom smoothly when messages change
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(isLoading ? 'auto' : 'smooth');
  }, [messages, isLoading]);

  // Speech synthesis functions
  const speakText = (text: string, messageId: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    setCurrentlySpeakingId(messageId);

    // Strip markdown characters for cleaner speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Bloc de code.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*#_>-]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;

    // Try finding a French voice
    const voices = synthRef.current.getVoices();
    const frenchVoice = voices.find(
      (v) => v.lang.startsWith('fr') || v.lang.includes('FR')
    );
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setCurrentlySpeakingId(null);
  };

  // Send message to MAXX AI server
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    stopSpeaking();

    const userMessageId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const assistantMessageId = `maxx-${Date.now() + 1}`;
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: 'model',
      text: '',
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isStreaming: true,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, assistantPlaceholder]);
    setIsLoading(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const contentType = response.headers.get('content-type') || '';

      // Check if response is streaming SSE
      if (contentType.includes('text/event-stream') && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              try {
                const data = JSON.parse(trimmed.slice(6));
                if (data.text) {
                  fullText += data.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, text: fullText, isStreaming: true }
                        : msg
                    )
                  );
                } else if (data.error) {
                  fullText = data.error;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, text: fullText, isStreaming: false }
                        : msg
                    )
                  );
                }
                if (data.done) {
                  break;
                }
              } catch (parseErr) {
                console.error('Error parsing SSE data:', parseErr);
              }
            }
          }
        }

        // Finalize message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, text: fullText, isStreaming: false }
              : msg
          )
        );

        if (voiceEnabled && fullText) {
          speakText(fullText, assistantMessageId);
        }
      } else {
        // Normal JSON response
        const data = await response.json();
        const responseText = data.text || "Aucune réponse reçue de l'assistant.";

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, text: responseText, isStreaming: false }
              : msg
          )
        );

        if (voiceEnabled && responseText) {
          speakText(responseText, assistantMessageId);
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Requête annulée par utilisateur');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  text: msg.text ? `${msg.text} *(Génération interrompue)*` : 'Génération arrêtée.',
                  isStreaming: false,
                }
              : msg
          )
        );
      } else {
        console.error('Erreur chat:', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  text:
                    "Désolé, une anomalie technique temporaire est survenue. Veuillez vérifier votre connexion ou réécrire votre question.",
                  isStreaming: false,
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-dynamic-screen bg-[#030712] text-slate-100 cyber-grid relative overflow-hidden select-text">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-cyan-600/15 via-blue-600/10 to-transparent blur-3xl"></div>

      {/* Main Header */}
      <Header
        onClearChat={handleClearChat}
        onOpenTestGuide={() => setIsTestGuideOpen(true)}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        hasMessages={messages.length > 0}
      />

      {/* Main Chat Scroll Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative">
        {messages.length === 0 ? (
          <WelcomeHero onSelectPrompt={handleSendMessage} />
        ) : (
          <div className="pb-6 divide-y divide-cyan-950/20">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isSpeaking={currentlySpeakingId === message.id}
                onSpeak={speakText}
                onStopSpeaking={stopSpeaking}
                onRetry={handleSendMessage}
              />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </main>

      {/* Bottom Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onStop={handleStopGeneration}
      />

      {/* Testing Instructions & Guide Modal */}
      <TestGuideModal
        isOpen={isTestGuideOpen}
        onClose={() => setIsTestGuideOpen(false)}
        onSelectPrompt={handleSendMessage}
      />
    </div>
  );
}
