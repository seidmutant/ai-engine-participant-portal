import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { Participant } from '../types';

interface ProfileEditorProps {
  currentUser: Participant | null;
  onClose: () => void;
  onSave: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  currentUser,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    university: currentUser?.university || '',
    email: currentUser?.email || '',
    graduation_year: currentUser?.graduation_year || new Date().getFullYear(),
    skills: currentUser?.skills || [],
    project_idea: currentUser?.project_idea || '',
    ai_interests: currentUser?.ai_interests || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in first');
        return;
      }

      if (currentUser) {
        // Update existing profile
        const { error } = await supabase
          .from('participants')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('participants')
          .insert([
            {
              ...formData,
              user_id: user.id,
            },
          ]);

        if (error) throw error;
      }

      toast.success('Profile saved successfully!');
      onSave();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const handleArrayInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'skills' | 'ai_interests'
  ) => {
    const value = e.target.value.split(',').map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#2d1b4e] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {currentUser ? 'Edit Profile' : 'Create Profile'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#b4ff39]/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#b4ff39]/20 rounded-lg focus:outline-none focus:border-[#b4ff39]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">University</label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, university: e.target.value }))
              }
              className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#b4ff39]/20 rounded-lg focus:outline-none focus:border-[#b4ff39]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#b4ff39]/20 rounded-lg focus:outline-none focus:border-[#b4ff39]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Graduation Year
            </label>
            <input
              type="number"
              value={formData.graduation_year}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  graduation_year: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#b4ff39]/20 rounded-lg focus:outline-none focus:border-[#b4ff39]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills.join(', ')}
              onChange={(e) => handleArrayInput(e, 'skills')}
              className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#b4ff39]/20 rounded-lg focus:outline-none focus:border-[#b4ff39]"
              placeholder="Python, React, Machine Learning"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Idea (optional)
            </label>
            <input
              type="text"
              value={formData.project_idea}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, project_idea: e.target.value }))
              }
              className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#b4ff39]/20 rounded-lg focus:outline-none focus:border-[#b4ff39]"
              placeholder="Describe your project idea"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              AI Interests (comma-separated, optional)
            </label>
            <input
              type="text"
              value={formData.ai_interests.join(', ')}
              onChange={(e) => handleArrayInput(e, 'ai_interests')}
              className="w-full px-4 py-2 bg-[#1a0b2e] border border-[#b4ff39]/20 rounded-lg focus:outline-none focus:border-[#b4ff39]"
              placeholder="LLMs, Computer Vision, NLP"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#b4ff39] text-[#1a0b2e] rounded-lg font-semibold hover:bg-[#b4ff39]/90 transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;