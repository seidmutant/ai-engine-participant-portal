import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Brain, Rocket, School, User } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Participant } from './types';
import ParticipantCard from './components/ParticipantCard';
import ProfileEditor from './components/ProfileEditor';

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);

  useEffect(() => {
    fetchParticipants();
    checkCurrentUser();
  }, []);

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from('participants')
      .select('*');
    
    if (error) {
      console.error('Error fetching participants:', error);
      return;
    }

    setParticipants(data);
  };

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('participants')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setCurrentUser(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] text-[#b4ff39]">
      <Toaster />
      
      {/* Header */}
      <header className="border-b border-[#b4ff39]/20 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold font-mono tracking-tight">
            AI ENGINE: UK UNIVERSITY HACKATHON
          </h1>
          <p className="mt-2 text-[#b4ff39]/80">
            Find your perfect hackathon teammate
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: User, label: 'Participants', value: participants.length },
            { icon: School, label: 'Universities', value: new Set(participants.map(p => p.university)).size },
            { icon: Brain, label: 'Skills', value: new Set(participants.flatMap(p => p.skills)).size },
            { icon: Rocket, label: 'Project Ideas', value: participants.filter(p => p.project_idea).length }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#2d1b4e] rounded-lg p-6 border border-[#b4ff39]/20">
              <Icon className="w-8 h-8 mb-2" />
              <p className="text-sm text-[#b4ff39]/60">{label}</p>
              <p className="text-3xl font-mono font-bold">{value}</p>
            </div>
          ))}
        </div>

        {/* Profile Editor */}
        <button
          onClick={() => setIsEditing(true)}
          className="mb-8 px-6 py-3 bg-[#b4ff39] text-[#1a0b2e] rounded-lg font-semibold hover:bg-[#b4ff39]/90 transition-colors"
        >
          {currentUser ? 'Edit Your Profile' : 'Create Your Profile'}
        </button>

        {isEditing && (
          <ProfileEditor
            currentUser={currentUser}
            onClose={() => setIsEditing(false)}
            onSave={() => {
              setIsEditing(false);
              fetchParticipants();
              checkCurrentUser();
            }}
          />
        )}

        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;