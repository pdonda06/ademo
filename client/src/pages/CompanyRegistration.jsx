import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';

export default function CompanyRegistration() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/company/register', data);
      toast.success('Company registered successfully');
      navigate('/expenses');
    } catch (error) {
      toast.error('Failed to register company');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Register Your Company</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            {...register('name', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tax ID</label>
          <input
            {...register('taxId', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Industry</label>
          <select
            {...register('industry', { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Industry</option>
            <option value="technology">Technology</option>
            <option value="retail">Retail</option>
            <option value="healthcare">Healthcare</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="services">Services</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input
            {...register('contactEmail', { required: true, type: 'email' })}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Register Company
        </button>
      </form>
    </div>
  );
}
