
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Building, User, ArrowLeft } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'admin' | 'vendor' | 'employee') => void;
  onBack: () => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect, onBack }) => {
  const roles = [
    {
      id: 'admin' as const,
      title: 'Admin',
      description: 'Full access to all platform features and management tools',
      icon: Crown,
      color: 'from-red-500 to-pink-600',
      hoverColor: 'hover:from-red-600 hover:to-pink-700',
      features: ['User Management', 'Project Oversight', 'Financial Reports', 'System Settings']
    },
    {
      id: 'vendor' as const,
      title: 'Vendor',
      description: 'Access vendor management tools and collaboration features',
      icon: Building,
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-700',
      features: ['Vendor Portal', 'Contract Management', 'Purchase Orders', 'Invoicing']
    },
    {
      id: 'employee' as const,
      title: 'Employee/Resource',
      description: 'Track time, manage tasks, and submit timesheets',
      icon: User,
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
      features: ['Timesheet Entry', 'Task Management', 'Project View', 'Time Tracking']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Who are you?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select your role to access the features designed for you
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-scale-in">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${role.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <role.icon className="h-10 w-10 text-white" />
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">{role.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{role.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => onRoleSelect(role.id)}
                  className={`w-full bg-gradient-to-r ${role.color} ${role.hoverColor} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  Continue as {role.title}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Your role determines which features and data you can access within the platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
