import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Sparkles,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { suggestedQueries } from '../data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Assistant. I can help answer questions about your health, medications, symptoms, and provide general medical information. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(textToSend),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('medication') || lowerQuery.includes('medicine')) {
      return 'Based on your profile, you\'re currently taking 5 active medications. Your adherence rate is 92%, which is excellent! Would you like me to:\n\n1. Review your medication schedule\n2. Set up reminders\n3. Check for potential interactions\n4. Provide information about a specific medication';
    }
    
    if (lowerQuery.includes('blood pressure') || lowerQuery.includes('bp')) {
      return 'Your recent blood pressure readings show good control at an average of 125/82 mmHg. This is within the normal range. Here are some tips to maintain healthy blood pressure:\n\n• Continue your current medication (Lisinopril 10mg)\n• Reduce sodium intake to less than 2,300mg/day\n• Exercise regularly (30 mins, 5 days/week)\n• Monitor BP daily\n\nWould you like to see your BP trend chart?';
    }
    
    if (lowerQuery.includes('appointment') || lowerQuery.includes('book')) {
      return 'I can help you book an appointment! You have 3 upcoming appointments scheduled. Would you like to:\n\n1. Book a new appointment\n2. View upcoming appointments\n3. Find a specialist\n4. Check available time slots';
    }
    
    if (lowerQuery.includes('symptom') || lowerQuery.includes('feeling')) {
      return 'I can help assess your symptoms. For the most accurate evaluation, I\'d recommend using our AI Symptom Checker. However, I can provide some general information.\n\n⚠️ If you\'re experiencing severe symptoms like:\n• Chest pain\n• Difficulty breathing\n• Severe bleeding\n• Loss of consciousness\n\nPlease seek immediate medical attention or call emergency services.\n\nFor non-emergency symptoms, would you like to start a symptom assessment?';
    }
    
    if (lowerQuery.includes('diet') || lowerQuery.includes('food') || lowerQuery.includes('nutrition')) {
      return 'Based on your health profile, here are some dietary recommendations:\n\n✅ Recommended:\n• Fruits and vegetables (5+ servings/day)\n• Whole grains\n• Lean proteins (fish, chicken, beans)\n• Low-fat dairy\n• Nuts and seeds\n\n❌ Limit:\n• Sodium (less than 2,300mg/day)\n• Saturated fats\n• Processed foods\n• Sugary beverages\n\nWould you like a personalized meal plan?';
    }
    
    return 'I understand you\'re asking about "' + query + '". While I can provide general health information, I recommend:\n\n1. Consulting with your healthcare provider for personalized medical advice\n2. Using our specialized features like Symptom Checker or booking an appointment\n3. Reviewing your medical history and records\n\nIs there something specific I can help you with regarding your health records, appointments, or medications?';
  };

  const handleSuggestedQuery = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Health Assistant</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
              <span className="text-sm text-gray-600">Online & Ready to Help</span>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI Powered
        </Badge>
      </div>

      <div className="flex-1 grid lg:grid-cols-4 gap-4 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardContent className="p-4 flex flex-col flex-1 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <Avatar className={`w-8 h-8 flex-shrink-0 ${
                        message.role === 'assistant' 
                          ? 'bg-gradient-to-br from-primary to-blue-600' 
                          : 'bg-gray-600'
                      }`}>
                        <AvatarFallback className="text-white">
                          {message.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>

                      {/* Message Content */}
                      <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                        <div
                          className={`
                            inline-block px-4 py-3 rounded-2xl max-w-[80%]
                            ${message.role === 'user' 
                              ? 'bg-primary text-white rounded-tr-none' 
                              : 'bg-gray-100 text-gray-900 rounded-tl-none'
                            }
                          `}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                          <div className={`flex items-center gap-1 mt-2 text-xs ${
                            message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>
                              {message.timestamp.toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600">
                      <AvatarFallback className="text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your health question..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!input.trim() || isTyping}
                  size="icon"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 overflow-y-auto">
          {/* Suggested Queries */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Quick Questions
              </h3>
              <div className="space-y-2">
                {suggestedQueries.map((query, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSuggestedQuery(query)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isTyping}
                  >
                    {query}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm mb-1">AI Assistant Info</h3>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    This AI assistant provides general health information based on your records. 
                    For medical emergencies or specific diagnoses, always consult a healthcare professional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">🔒 Privacy & Security</h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• End-to-end encrypted</li>
                <li>• HIPAA compliant</li>
                <li>• Conversations are private</li>
                <li>• Data not shared with third parties</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
