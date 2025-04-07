import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the exchange schema using Zod
const exchangeSchema = z.object({
  direction: z.enum(['provided', 'received']),
  participant: z.string().min(1, 'Please select a participant'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  category: z.enum([
    'food-necessities',
    'repairs-maintenance',
    'creative-works',
    'care-work',
    'knowledge-teaching',
    'physical-goods',
    'services-skills',
    'other'
  ]),
  pebsAmount: z.number().positive('Pebs amount must be positive'),
  notes: z.string().optional(),
  location: z.string().optional(),
  exchangeDate: z.date().default(() => new Date())
});

type ExchangeFormData = z.infer<typeof exchangeSchema>;

interface User {
  _id: string;
  displayName: string;
  username: string;
}

interface ExchangeFormProps {
  users: User[];
  onSubmit: (data: ExchangeFormData) => void;
  isLoading: boolean;
}

const ExchangeForm: React.FC<ExchangeFormProps> = ({ users, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      direction: 'provided',
      pebsAmount: 1,
      exchangeDate: new Date()
    }
  });
  
  // Category options
  const categoryOptions = [
    { value: 'food-necessities', label: 'Food & Necessities' },
    { value: 'repairs-maintenance', label: 'Repairs & Maintenance' },
    { value: 'creative-works', label: 'Creative Works' },
    { value: 'care-work', label: 'Care Work & Emotional Labor' },
    { value: 'knowledge-teaching', label: 'Knowledge Sharing & Teaching' },
    { value: 'physical-goods', label: 'Physical Goods' },
    { value: 'services-skills', label: 'Services & Skills' },
    { value: 'other', label: 'Other' }
  ];
  
  const submitForm = (data: ExchangeFormData) => {
    onSubmit(data);
    reset();
  };
  
  return (
    <div className="peb-card">
      <h2 className="text-xl font-semibold mb-4 text-emerald-700">Record a New Exchange</h2>
      
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
        {/* Direction */}
        <div className="space-y-1">
          <label className="block text-gray-700">Exchange Direction</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="provided"
                {...register('direction')}
                className="form-radio text-emerald-500"
              />
              <span className="ml-2">I provided goods/services</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="received"
                {...register('direction')}
                className="form-radio text-emerald-500"
              />
              <span className="ml-2">I received goods/services</span>
            </label>
          </div>
          {errors.direction && (
            <p className="text-red-500 text-sm">{errors.direction.message}</p>
          )}
        </div>
        
        {/* Participant */}
        <div className="space-y-1">
          <label htmlFor="participant" className="block text-gray-700">
            Exchange With
          </label>
          <select
            id="participant"
            {...register('participant')}
            className="peb-input w-full"
          >
            <option value="">Select a person</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.displayName} (@{user.username})
              </option>
            ))}
          </select>
          {errors.participant && (
            <p className="text-red-500 text-sm">{errors.participant.message}</p>
          )}
        </div>
        
        {/* Category */}
        <div className="space-y-1">
          <label htmlFor="category" className="block text-gray-700">
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className="peb-input w-full"
          >
            <option value="">Select a category</option>
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>
        
        {/* Description */}
        <div className="space-y-1">
          <label htmlFor="description" className="block text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="peb-input w-full"
            rows={3}
            placeholder="Describe what was exchanged..."
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        
        {/* Pebs Amount */}
        <div className="space-y-1">
          <label htmlFor="pebsAmount" className="block text-gray-700">
            Pebs Amount
          </label>
          <input
            id="pebsAmount"
            type="number"
            {...register('pebsAmount', { valueAsNumber: true })}
            className="peb-input w-full"
            min="0.1"
            step="0.1"
          />
          {errors.pebsAmount && (
            <p className="text-red-500 text-sm">{errors.pebsAmount.message}</p>
          )}
        </div>
        
        {/* Notes */}
        <div className="space-y-1">
          <label htmlFor="notes" className="block text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            className="peb-input w-full"
            rows={2}
            placeholder="Any additional context or notes..."
          ></textarea>
        </div>
        
        {/* Location */}
        <div className="space-y-1">
          <label htmlFor="location" className="block text-gray-700">
            Location (Optional)
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="peb-input w-full"
            placeholder="Where did this exchange take place?"
          />
        </div>
        
        {/* Exchange Date */}
        <div className="space-y-1">
          <label htmlFor="exchangeDate" className="block text-gray-700">
            Date of Exchange
          </label>
          <input
            id="exchangeDate"
            type="date"
            {...register('exchangeDate', { valueAsDate: true })}
            className="peb-input w-full"
          />
          {errors.exchangeDate && (
            <p className="text-red-500 text-sm">{errors.exchangeDate.message}</p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="peb-button w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Recording Exchange...' : 'Record Exchange'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExchangeForm; 