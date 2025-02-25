import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import type { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant }) => {
  const handleContactClick = () => {
    window.location.href = `mailto:${participant.email}`;
  };

  return (
    <div className="bg-[#2d1b4e] rounded-lg p-6 border border-[#b4ff39]/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{participant.name}</h3>
          <p className="text-[#b4ff39]/60">{participant.university}</p>
        </div>
        <button
          onClick={handleContactClick}
          className="p-2 hover:bg-[#b4ff39]/10 rounded-full transition-colors"
        >
          <Mail className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-[#b4ff39]/60 mb-1">Skills</p>
          <div className="flex flex-wrap gap-2">
            {participant.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-[#b4ff39]/10 rounded-md text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {participant.project_idea && (
          <div>
            <p className="text-sm text-[#b4ff39]/60 mb-1">Project Idea</p>
            <p className="text-sm">{participant.project_idea}</p>
          </div>
        )}

        {participant.ai_interests && participant.ai_interests.length > 0 && (
          <div>
            <p className="text-sm text-[#b4ff39]/60 mb-1">AI Interests</p>
            <div className="flex flex-wrap gap-2">
              {participant.ai_interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-1 bg-[#b4ff39]/10 rounded-md text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantCard