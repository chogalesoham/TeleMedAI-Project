import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Stethoscope, Loader2, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { aiService } from '@/services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  options?: string[];
}

import { getStoredUser } from '@/services/auth.service';

const SymptomIntake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'intake' | 'chat'>('intake');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    symptom: '',
    duration: '',
    severity: '',
    temperature: '',
    isEmergency: false
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [roundCount, setRoundCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MAX_ROUNDS = 6;

  const user = getStoredUser();
  const userId = user?.id || user?._id;

  const patientInfo = {
    name: user?.name || "Patient",
    age: user?.age || 30,
    gender: user?.gender || "Not specified",
    existingDiseases: user?.existingDiseases || ["None"],
    allergies: user?.allergies || ["None"],
    medications: user?.medications || ["None"],
    vitals: {
      heartRate: "72 bpm",
      bloodPressure: "120/80 mmHg",
      temperature: "98.6 F"
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symptom) {
      toast({ title: "Error", description: "Please describe your symptoms.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const analysis = await aiService.initialProblem(formData.symptom);

      setStep('chat');
      const initialMessage: Message = {
        id: '1',
        role: 'assistant',
        content: `I understand you're experiencing ${formData.symptom}. I'll ask a few questions to better understand your condition.`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);

      await generateNextQuestion([initialMessage]);

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to start analysis.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNextQuestion = async (currentHistory: Message[]) => {
    setIsTyping(true);
    try {
      const apiHistory = currentHistory.map(m => ({ role: m.role, content: m.content }));
      const response = await aiService.nextQuestion(apiHistory, patientInfo);

      const nextMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.question,
        options: response.options,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, nextMsg]);
      setRoundCount(prev => prev + 1);

      if (response.is_final || roundCount >= MAX_ROUNDS) {
        handleCompletion([...currentHistory, nextMsg]);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');

    if (roundCount < MAX_ROUNDS) {
      await generateNextQuestion(updatedMessages);
    } else {
      await handleCompletion(updatedMessages);
    }
  };

  const handleCompletion = async (finalHistory: Message[]) => {
    setIsLoading(true);
    try {
      const apiHistory = finalHistory.map(m => ({ role: m.role, content: m.content }));

      const summaryData = await aiService.finalSummary(apiHistory, patientInfo);

      const reportPayload = {
        userId,
        patientInfo,
        conversationHistory: apiHistory,
        symptoms: [formData.symptom],
        differentialDiagnoses: summaryData.possible_conditions,
        tests: summaryData.recommendations.filter((r: string) => r.toLowerCase().includes('test') || r.toLowerCase().includes('scan')),
        urgency: { level: 'Moderate', description: 'AI Assessment' },
        redFlags: [],
        medications: [],
        lifestyleAdvice: summaryData.recommendations,
        dietPlan: [],
        followUpRecommendation: summaryData.specialist_recommendation,
        summary: summaryData.summary_text
      };

      const savedReport = await aiService.createReport(reportPayload);

      toast({ title: "Success", description: "Report generated successfully." });
      navigate('/patient-dashboard/report-summary', { state: { report: savedReport.data } });

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate report.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'intake' ? (
            <motion.div
              key="intake"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 mb-6 shadow-lg"
                >
                  <Stethoscope className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Health Check</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Describe your symptoms and our AI will help analyze your condition
                </p>
              </div>

              {/* Form Card */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    Tell Us About Your Symptoms
                  </CardTitle>
                  <CardDescription className="text-base">
                    Provide as much detail as possible for accurate analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleIntakeSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <Label htmlFor="symptom" className="text-base font-semibold text-gray-700">
                        What are you experiencing? *
                      </Label>
                      <Textarea
                        id="symptom"
                        placeholder="Example: I have a persistent headache on the right side of my head, along with nausea and sensitivity to light..."
                        value={formData.symptom}
                        onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                        className="min-h-[140px] text-base border-2 focus:border-blue-500 transition-colors"
                        required
                      />
                      <p className="text-sm text-gray-500">Be specific about location, intensity, and any patterns you've noticed</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="duration" className="text-base font-semibold text-gray-700">
                          How long have you had these symptoms?
                        </Label>
                        <Select onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                          <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="today">Just today</SelectItem>
                            <SelectItem value="few_days">A few days</SelectItem>
                            <SelectItem value="week">About a week</SelectItem>
                            <SelectItem value="month">More than a month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="severity" className="text-base font-semibold text-gray-700">
                          Pain/Discomfort Level (1-10)
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={formData.severity}
                          onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                          placeholder="Rate from 1 (mild) to 10 (severe)"
                          className="h-12 text-base border-2 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Starting AI Analysis...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Start AI Analysis
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Info Note */}
              <div className="text-center text-sm text-gray-500 bg-white rounded-lg p-4 shadow-sm">
                <p>🔒 Your information is secure and confidential. This is not a replacement for professional medical advice.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 max-w-4xl mx-auto"
            >
              {/* Chat Header */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                        <Bot className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">AI Health Assistant</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Online and analyzing
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">Progress</div>
                      <div className="text-2xl font-bold text-blue-600">{roundCount}/{MAX_ROUNDS}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Question {roundCount} of {MAX_ROUNDS}</span>
                      <span>{Math.round((roundCount / MAX_ROUNDS) * 100)}% Complete</span>
                    </div>
                    <Progress value={(roundCount / MAX_ROUNDS) * 100} className="h-2 bg-gray-200" />
                  </div>
                </CardContent>
              </Card>

              {/* Messages Container */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="h-[550px] overflow-y-auto space-y-6 pr-2">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-green-500 to-green-600'
                            : 'bg-gradient-to-br from-blue-500 to-blue-600'
                            } shadow-md`}>
                            {msg.role === 'user' ? (
                              <span className="text-white font-semibold text-sm">You</span>
                            ) : (
                              <Bot className="w-5 h-5 text-white" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div className="flex-1">
                            <div
                              className={`p-4 rounded-2xl shadow-md ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-tr-sm'
                                : 'bg-white border-2 border-gray-100 text-gray-900 rounded-tl-sm'
                                }`}
                            >
                              <p className="leading-relaxed">{msg.content}</p>
                            </div>

                            {/* Quick Reply Options */}
                            {msg.options && msg.options.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {msg.options.map((option, idx) => (
                                  <Button
                                    key={idx}
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-left h-auto py-3 px-4 bg-white hover:bg-blue-50 hover:border-blue-300 border-2 transition-all"
                                    onClick={() => handleSendMessage(option)}
                                  >
                                    <span className="text-blue-600 mr-2">→</span>
                                    {option}
                                  </Button>
                                ))}
                              </div>
                            )}

                            {/* Timestamp */}
                            <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-right' : 'text-left'} text-gray-400`}>
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-md">
                            <div className="flex gap-1.5">
                              <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
              </Card>

              {/* Input Area */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(input);
                    }}
                    className="flex gap-3"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your answer here..."
                      disabled={isLoading || isTyping}
                      className="flex-1 h-12 text-base border-2 focus:border-blue-500"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || isTyping || !input.trim()}
                      className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send • Click the options above for quick replies
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SymptomIntake;
