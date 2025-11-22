import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Search,
  Book,
  FileText,
  Video,
  Clock,
  CheckCircle2,
  ExternalLink,
  Headphones,
  MessageCircle,
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I book an appointment?',
    answer:
      'You can book an appointment by navigating to the "Book Appointment" page from the dashboard. Select your preferred doctor, choose a time slot, and confirm your booking. You\'ll receive a confirmation via email and SMS.',
    category: 'Appointments',
  },
  {
    question: 'Can I reschedule or cancel my appointment?',
    answer:
      'Yes, you can reschedule or cancel appointments up to 2 hours before the scheduled time. Go to "My Appointments", select the appointment, and choose the appropriate option. Please note that late cancellations may incur a fee.',
    category: 'Appointments',
  },
  {
    question: 'How do I join a video consultation?',
    answer:
      'When it\'s time for your appointment, go to the "Waiting Room" from your dashboard. The doctor will join shortly. Make sure you have a stable internet connection and allow camera and microphone permissions.',
    category: 'Consultations',
  },
  {
    question: 'What if I miss my scheduled consultation?',
    answer:
      'If you miss your appointment, it will be marked as "No Show" and you may be charged the consultation fee. Please try to cancel or reschedule in advance if you cannot make it.',
    category: 'Consultations',
  },
  {
    question: 'How do I access my medical records?',
    answer:
      'All your medical records, including prescriptions, lab reports, and consultation summaries, are available in the "Medical History" section. You can view, download, or share these records securely.',
    category: 'Medical Records',
  },
  {
    question: 'Can I upload my own medical reports?',
    answer:
      'Yes! Go to "Upload Reports" section and drag-and-drop your medical documents. Our AI system will analyze and organize them automatically. Supported formats include PDF, JPG, and PNG.',
    category: 'Medical Records',
  },
  {
    question: 'How do prescription refills work?',
    answer:
      'For prescription refills, go to your "Medications" page and request a refill for the medication you need. Your doctor will review and approve the request, after which you can pick it up from your preferred pharmacy.',
    category: 'Medications',
  },
  {
    question: 'Are medication reminders automatic?',
    answer:
      'Yes, once a prescription is added to your profile, medication reminders are automatically set up based on the prescribed schedule. You can customize reminder times in Settings.',
    category: 'Medications',
  },
  {
    question: 'Is my health data secure?',
    answer:
      'Absolutely. We use bank-level encryption and are HIPAA compliant. Your data is stored securely and never shared without your explicit consent. You can review our security measures in the Privacy Policy.',
    category: 'Privacy',
  },
  {
    question: 'How are consultation fees charged?',
    answer:
      'Consultation fees are charged after the appointment is confirmed. We accept all major credit cards, debit cards, and health insurance. You\'ll receive a detailed invoice via email.',
    category: 'Billing',
  },
  {
    question: 'Does insurance cover telemedicine consultations?',
    answer:
      'Many insurance plans now cover telemedicine. Check with your insurance provider or contact our billing support to verify your coverage. We can submit claims directly to most major insurers.',
    category: 'Billing',
  },
  {
    question: 'How does the AI chatbot work?',
    answer:
      'Our AI chatbot uses advanced medical knowledge to answer common health questions and provide guidance. It can help with symptom checking, medication information, and general health queries. For serious concerns, always consult a doctor.',
    category: 'AI Features',
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

const Support = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Support Request Submitted',
      description: "We've received your message. Our team will respond within 24 hours.",
    });
    setContactForm({ name: '', email: '', subject: '', category: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          </div>
          <p className="text-gray-600">
            Find answers to common questions or reach out to our support team
          </p>
        </motion.div>

        {/* Quick Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Call Us</h3>
                <p className="text-sm text-gray-600">Mon-Fri, 9 AM - 6 PM</p>
                <p className="text-blue-600 font-medium mt-2">1-800-TELEMED</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Average response: 2 min</p>
                <Button variant="link" className="text-green-600 mt-2 p-0">
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Us</h3>
                <p className="text-sm text-gray-600">Response within 24 hrs</p>
                <p className="text-purple-600 font-medium mt-2">support@telemed.com</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-blue-600" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search & Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* FAQ Accordion */}
                  <Accordion type="single" collapsible className="space-y-2">
                    <AnimatePresence>
                      {filteredFAQs.map((faq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <AccordionItem value={`item-${index}`} className="border rounded-lg px-4">
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-start gap-3 text-left">
                                <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="font-medium">{faq.question}</p>
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    {faq.category}
                                  </Badge>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-gray-600 pl-8">{faq.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </Accordion>

                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No FAQs found matching your search</p>
                      <p className="text-sm text-gray-500">Try different keywords or categories</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={contactForm.subject}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, subject: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={contactForm.category}
                          onValueChange={(value) =>
                            setContactForm({ ...contactForm, category: value })
                          }
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, message: e.target.value })
                        }
                        rows={6}
                        placeholder="Describe your issue or question..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Resources Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Help Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" target="_blank">
                      <Book className="h-4 w-4 mr-2" />
                      User Guide
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>

                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" target="_blank">
                      <Video className="h-4 w-4 mr-2" />
                      Video Tutorials
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>

                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" target="_blank">
                      <FileText className="h-4 w-4 mr-2" />
                      Privacy Policy
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>

                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" target="_blank">
                      <FileText className="h-4 w-4 mr-2" />
                      Terms of Service
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">24/7 Support</h3>
                  </div>
                  <p className="text-sm text-green-800">
                    Our support team is available round the clock to assist you with any urgent
                    medical or technical issues.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Clock className="h-4 w-4" />
                    <span>Average response time: 5 minutes</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Helpful Tips</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Test your camera before video consultations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Keep your medical history updated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Upload reports in PDF or JPG format</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Enable notifications for reminders</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
