import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { aiService } from '@/services/aiService';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export const PreDiagnosis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roundCount, setRoundCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Initial data from SymptomIntake
  const { symptoms, description, duration, severity, initialAnalysis } = location.state || {};

  useEffect(() => {
    if (!initialAnalysis) {
      navigate('/patient-dashboard/symptom-intake');
      return;
    }

    const initialMessages: Message[] = [
      {
        role: 'assistant',
        content: `Hello. I've reviewed your initial symptoms. ${initialAnalysis.triage_advice || ''} I'm going to ask you a few questions to better understand your condition. Let's start.`,
        timestamp: new Date()
      }
    ];
    setMessages(initialMessages);

    // Start the question loop
    fetchNextQuestion(initialMessages);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const fetchNextQuestion = async (currentHistory: Message[]) => {
    setIsTyping(true);
    try {
      const historyForApi = currentHistory.map(m => ({ role: m.role, content: m.content }));
      const patientInfo = { symptoms, description, duration, severity };

      const response = await aiService.nextQuestion(historyForApi, patientInfo);

      setIsTyping(false);
      if (response.question) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.question,
          timestamp: new Date()
        }]);

        if (response.is_final || roundCount >= 15) {
          handleCompletion(currentHistory);
        }
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    const newHistory = [...messages, userMsg];

    setMessages(newHistory);
    setInput('');
    setRoundCount(prev => prev + 1);

    // Extract entities (background)
    aiService.extractEntities(input);

    if (roundCount < 15) {
      await fetchNextQuestion(newHistory);
    } else {
      await handleCompletion(newHistory);
    }
  };

  const handleCompletion = async (history: Message[]) => {
    setIsLoading(true);
    setIsTyping(true);
    try {
      const historyForApi = history.map(m => ({ role: m.role, content: m.content }));
      const patientInfo = { symptoms, description, duration, severity };

      const summary = await aiService.finalSummary(historyForApi, patientInfo);

      // Create Report
      const reportData = {
        userId: "6745d606305607062483804d", // TODO: Replace with actual user ID
        patientInfo: {
          name: "Test Patient", // TODO: Replace
          age: 30,
          gender: "Male",
          existingDiseases: [],
          allergies: [],
          medications: [],
          vitals: {}
        },
        conversationHistory: historyForApi,
        symptoms: symptoms || [],
        differentialDiagnoses: summary.possible_conditions.map((c: any) => ({
          condition: c.condition,
          probability: parseInt(c.probability) || 50,
          description: c.description,
          severity: c.severity,
          progress: parseInt(c.probability) || 50
        })),
        tests: [], // AI could suggest these
        urgency: {
          level: 'Moderate', // AI should determine this
          description: 'Please consult a doctor.'
        },
        redFlags: [],
        medications: [], // AI could suggest OTC
        lifestyleAdvice: summary.recommendations,
        dietPlan: [],
        summary: summary.summary_text
      };

      const savedReport = await aiService.createReport(reportData);

      navigate('/patient-dashboard/final-summary', { state: { report: savedReport.data } });

    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl h-[calc(100vh-100px)] flex flex-col gap-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-xl font-bold text-gray-800">AI Diagnostic Chat</h1>
          <p className="text-sm text-gray-500">Dr. AI is analyzing your symptoms</p>
        </div>
        <div className="w-32">
          <div className="flex justify-between text-xs mb-1 text-gray-500">
            <span>Progress</span>
            <span>{Math.min(roundCount, 15)}/15</span>
          </div>
          <Progress value={(roundCount / 15) * 100} className="h-2" />
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col shadow-md border-0 bg-gray-50/50">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className={`w-8 h-8 ${msg.role === 'assistant' ? 'bg-blue-100' : 'bg-green-100'}`}>
                <AvatarFallback className={msg.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </AvatarFallback>
              </Avatar>
              <div
                className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-white text-gray-800 border rounded-tl-none'
                  }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Avatar className="w-8 h-8 bg-blue-100">
                <AvatarFallback className="text-blue-600"><Bot size={16} /></AvatarFallback>
              </Avatar>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border shadow-sm flex gap-1 items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </CardContent>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-2 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Type your answer..."
              disabled={isLoading}
              className="pr-12 h-12 text-base bg-gray-50 border-gray-200 focus-visible:ring-primary/20"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 transition-all hover:scale-105"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            AI can make mistakes. Please consult a doctor for serious concerns.
          </p>
        </div>
      </Card>
    </div>
  );
};
