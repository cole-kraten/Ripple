'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewExchangePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    providerUsername: '',
    receiverUsername: '',
    description: '',
    category: '',
    pebsAmount: '',
    details: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // This would be replaced with a real API call in a production app
      // const response = await fetch('http://localhost:3001/api/exchanges', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // For demo purposes, just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: 'Exchange recorded successfully!' 
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/exchanges');
      }, 2000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to record exchange. Please try again.' 
      });
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '36rem', margin: '0 auto' }}>
      <Link href="/exchanges" style={{ 
        color: '#92400e', 
        textDecoration: 'none',
        fontWeight: '500',
        display: 'block',
        marginBottom: '2rem'
      }}>
        &larr; Back to Exchanges
      </Link>

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: '#92400e', 
        marginBottom: '1.5rem' 
      }}>
        Record New Exchange
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
          Record a new exchange of goods or services between community members.
          All exchanges are public and will appear on the community ledger.
        </p>
        
        {message && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1.5rem',
            borderRadius: '0.25rem',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#b91c1c'
          }}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="providerUsername" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#4b5563' 
              }}
            >
              Provider Username
            </label>
            <input
              id="providerUsername"
              type="text"
              name="providerUsername"
              value={formData.providerUsername}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                outline: 'none'
              }}
              placeholder="Who provided the goods or service?"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="receiverUsername" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#4b5563' 
              }}
            >
              Receiver Username
            </label>
            <input
              id="receiverUsername"
              type="text"
              name="receiverUsername"
              value={formData.receiverUsername}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                outline: 'none'
              }}
              placeholder="Who received the goods or service?"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="description" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#4b5563' 
              }}
            >
              Brief Description
            </label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                outline: 'none'
              }}
              placeholder="e.g. 'Home-cooked meals for 3 days'"
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="category" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#4b5563' 
              }}
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                outline: 'none'
              }}
            >
              <option value="">Select a category</option>
              <option value="food-necessities">Food & Necessities</option>
              <option value="repairs-maintenance">Repairs & Maintenance</option>
              <option value="creative-works">Creative Works</option>
              <option value="care-work">Care Work</option>
              <option value="knowledge-teaching">Knowledge & Teaching</option>
              <option value="physical-goods">Physical Goods</option>
              <option value="services-skills">Services & Skills</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="pebsAmount" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#4b5563' 
              }}
            >
              Pebs Amount
            </label>
            <input
              id="pebsAmount"
              type="number"
              name="pebsAmount"
              value={formData.pebsAmount}
              onChange={handleChange}
              required
              min="1"
              max="100"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                outline: 'none'
              }}
              placeholder="How many pebs was this worth?"
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="details" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#4b5563' 
              }}
            >
              Additional Details (Optional)
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="4"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                outline: 'none'
              }}
              placeholder="Any additional information about this exchange"
            ></textarea>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              padding: '0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: '#fff9db',
              color: '#92400e',
              fontSize: '0.875rem'
            }}>
              <strong>Note:</strong> Both provider and receiver will need to confirm
              this exchange. An email notification will be sent to the receiver.
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Recording Exchange...' : 'Record Exchange'}
          </button>
        </form>
      </div>
    </div>
  );
} 