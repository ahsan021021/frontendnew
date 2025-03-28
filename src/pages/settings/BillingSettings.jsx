import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51QzOYG2MWieuisj2wn3zMsNYgmAIHK9dfzBvf21D6FeLBoDqcQ086js6otEiAxpK53xSPwdgooBMeshGn6k2tS7300GySQZ0FT'); // Replace with your Stripe Publishable Key

function BillingSettings() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);

  const plans = [
    { id: 'free', name: 'Free', price: '$0', features: ['Basic features'] },
    { id: 'basic', name: 'Basic', price: '$10', features: ['Feature 1', 'Feature 2'] },
    { id: 'pro', name: 'Pro', price: '$29', features: ['All Basic features', 'Feature 3', 'Feature 4'] },
    { id: 'premium', name: 'Premium', price: '$99', features: ['All Pro features', 'Feature 5', 'Feature 6'] },
  ];

  useEffect(() => {
    const fetchBillingDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch payment methods
        const paymentMethodsResponse = await axios.get('http://82.180.137.7:5000/api/payment/get-payment-methods', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaymentMethods(paymentMethodsResponse.data.paymentMethods);

        // Fetch current subscription plan
        const subscriptionResponse = await axios.get('http://82.180.137.7:5000/api/user/subscription-plan', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentPlan(subscriptionResponse.data.plan);
      } catch (error) {
        console.error('Error fetching billing details:', error);
        setMessage('Failed to fetch billing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingDetails();
  }, []);

  const handleAddPaymentMethod = async (paymentMethodId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://82.180.137.7:5000/api/payment/add-payment-method',
        { paymentMethodId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      const updatedPaymentMethodsResponse = await axios.get('http://82.180.137.7:5000/api/payment/get-payment-methods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentMethods(updatedPaymentMethodsResponse.data.paymentMethods);
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error('Failed to add payment method.');
    }
  };

  const handleDeletePaymentMethod = async () => {
    if (!paymentMethodToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://82.180.137.7:5000/api/payment/delete-payment-method/${paymentMethodToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      const updatedPaymentMethodsResponse = await axios.get('http://82.180.137.7:5000/api/payment/get-payment-methods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentMethods(updatedPaymentMethodsResponse.data.paymentMethods);
      setPaymentMethodToDelete(null);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to delete payment method.');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://82.180.137.7:5000/api/payment/set-default-payment-method',
        { paymentMethodId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      const updatedPaymentMethodsResponse = await axios.get('http://82.180.137.7:5000/api/payment/get-payment-methods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentMethods(updatedPaymentMethodsResponse.data.paymentMethods);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to set default payment method.');
    }
  };

  const handleSubscribe = async (planId, paymentMethodId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://82.180.137.7:5000/api/payment/create-subscription',
        { planId, paymentMethodId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      setCurrentPlan(planId);
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      toast.error('Failed to subscribe to the plan.');
    }
  };

  if (loading) {
    return <p>Loading billing details...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h3 className="text-2xl font-semibold text-white mb-8">Subscription Plans</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-6 ${
                  currentPlan === plan.id ? 'border-indigo-500 bg-gray-700' : 'border-gray-600 bg-gray-700'
                }`}
              >
                <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                <p className="mt-2 text-2xl font-bold text-indigo-400">{plan.price}</p>
                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg
                        className="h-5 w-5 text-indigo-400 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    setShowPaymentModal(true);
                  }}
                  className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-medium ${
                    currentPlan === plan.id ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-white'
                  }`}
                >
                  {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h3 className="text-2xl font-semibold text-white mb-8">Payment Methods</h3>
          <ul className="space-y-4">
            {paymentMethods.map((method) => (
              <li key={method.id} className="flex justify-between items-center">
                <span className="text-white">
                  {method.card.brand.toUpperCase()} **** {method.card.last4}
                </span>
                <div className="space-x-4">
                  <button
                    onClick={() => handleSetDefaultPaymentMethod(method.id)}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Set Default
                  </button>
                  <button
                    onClick={() => setPaymentMethodToDelete(method.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showPaymentModal && (
        <Elements stripe={stripePromise}>
          <PaymentModal
            selectedPlan={selectedPlan}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={(message) => {
              toast.success(message);
              setShowPaymentModal(false);
            }}
            onError={(error) => toast.error(error)}
          />
        </Elements>
      )}
    </div>
  );
}

export default BillingSettings;