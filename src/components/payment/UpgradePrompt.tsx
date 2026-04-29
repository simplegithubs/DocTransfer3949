import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
    feature: string;
    requiredPlan: 'standard' | 'business';
    onClose: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = () => {
    return null;
};

export default UpgradePrompt;
