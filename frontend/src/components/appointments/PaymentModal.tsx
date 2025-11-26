import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Wallet,
    Building2,
    CheckCircle,
    Loader2,
    X,
    Info,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: (paymentData: PaymentData) => void;
    doctorFee: number;
    platformFee: number;
    totalAmount: number;
    currency?: string;
    doctorName: string;
}

export interface PaymentData {
    paymentStatus: string;
    paymentId: string;
    paymentMethod: string;
}

const paymentMethods = [
    {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: CreditCard,
        description: 'Pay securely with your card',
    },
    {
        id: 'upi',
        name: 'UPI',
        icon: Wallet,
        description: 'Pay via UPI apps',
    },
    {
        id: 'netbanking',
        name: 'Net Banking',
        icon: Building2,
        description: 'Pay through your bank',
    },
];

export const PaymentModal = ({
    isOpen,
    onClose,
    onPaymentSuccess,
    doctorFee,
    platformFee,
    totalAmount,
    currency = 'INR',
    doctorName,
}: PaymentModalProps) => {
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        // Simulate payment processing (mock)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const paymentData: PaymentData = {
            paymentStatus: 'completed',
            paymentId: `MOCK_PAY_${Date.now()}`,
            paymentMethod: selectedMethod,
        };

        setIsProcessing(false);
        setPaymentComplete(true);

        // Show success animation for 1.5 seconds
        setTimeout(() => {
            onPaymentSuccess(paymentData);
            handleClose();
        }, 1500);
    };

    const handleClose = () => {
        setPaymentComplete(false);
        setIsProcessing(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Complete Payment</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            disabled={isProcessing}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </DialogTitle>
                    <DialogDescription>
                        Booking appointment with Dr. {doctorName}
                    </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {!paymentComplete ? (
                        <motion.div
                            key="payment-form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {/* Fee Breakdown */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Consultation Fee</span>
                                    <span className="font-medium">
                                        {currency} {doctorFee}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-600">Platform Fee</span>
                                        <Info className="w-3 h-3 text-gray-400" />
                                    </div>
                                    <span className="font-medium">
                                        {currency} {platformFee}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">Total Amount</span>
                                    <span className="font-bold text-lg text-primary">
                                        {currency} {totalAmount}
                                    </span>
                                </div>
                            </div>

                            {/* Platform Fee Info */}
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    <strong>Platform Fee:</strong> A small fee to maintain and improve our
                                    healthcare platform services.
                                </p>
                            </div>

                            {/* Payment Methods */}
                            <div>
                                <Label className="text-sm font-semibold mb-3 block">
                                    Select Payment Method
                                </Label>
                                <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                                    <div className="space-y-2">
                                        {paymentMethods.map(method => {
                                            const Icon = method.icon;
                                            return (
                                                <div
                                                    key={method.id}
                                                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedMethod === method.id
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    onClick={() => setSelectedMethod(method.id)}
                                                >
                                                    <RadioGroupItem value={method.id} id={method.id} />
                                                    <Icon className="w-5 h-5 text-gray-600" />
                                                    <div className="flex-1">
                                                        <Label
                                                            htmlFor={method.id}
                                                            className="font-medium cursor-pointer"
                                                        >
                                                            {method.name}
                                                        </Label>
                                                        <p className="text-xs text-gray-500">
                                                            {method.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Mock Payment Notice */}
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                <p className="text-xs text-yellow-800">
                                    <strong>Demo Mode:</strong> This is a mock payment for demonstration
                                    purposes. No actual transaction will occur.
                                </p>
                            </div>

                            {/* Payment Button */}
                            <Button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        Pay {currency} {totalAmount}
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="payment-success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="py-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            >
                                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Payment Successful!
                            </h3>
                            <p className="text-gray-600">
                                Your appointment has been booked successfully.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
