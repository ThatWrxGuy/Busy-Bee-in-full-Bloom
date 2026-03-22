/**
 * Busy Bee Onboarding - Design System Implementation
 */

import { useState } from 'react';
import { FiArrowRight, FiCheck, FiUser, FiTarget, FiZap } from 'react-icons/fi';
import { Button, Card, CardContent } from '../components';

const STEPS = [
  { id: 1, title: 'Create your profile', icon: FiUser, desc: 'Tell us about yourself' },
  { id: 2, title: 'Set your first goal', icon: FiTarget, desc: 'What do you want to achieve?' },
  { id: 3, title: 'Get started', icon: FiZap, desc: 'Start tracking your progress' },
];

const DOMAINS = [
  { id: 'health', emoji: '🏃', label: 'Health', selected: false },
  { id: 'career', emoji: '💼', label: 'Career', selected: false },
  { id: 'mindset', emoji: '🧠', label: 'Mindset', selected: false },
  { id: 'habits', emoji: '🔄', label: 'Habits', selected: false },
  { id: 'finance', emoji: '💰', label: 'Finance', selected: false },
  { id: 'relationships', emoji: '👥', label: 'Relationships', selected: false },
];

function Onboarding() {
  const [step, setStep] = useState(1);
  const [domains, setDomains] = useState(DOMAINS);
  const [name, setName] = useState('');

  const toggleDomain = (id) => {
    setDomains(domains.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d)));
  };

  const canContinue =
    step === 1
      ? name.trim().length > 0
      : step === 2
        ? domains.filter((d) => d.selected).length > 0
        : true;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step > s.id
                    ? 'bg-success text-white'
                    : step === s.id
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-foreground-muted'
                }`}
              >
                {step > s.id ? <FiCheck className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${step > s.id ? 'bg-success' : 'bg-secondary'}`} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground text-center mb-6">
                What's your name?
              </h2>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
                autoFocus
              />
              <Button className="w-full mt-6" onClick={() => setStep(2)} disabled={!canContinue}>
                Continue <FiArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground text-center mb-2">
                Select your focus areas
              </h2>
              <p className="text-foreground-muted text-center mb-6">Choose at least one domain</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => toggleDomain(domain.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      domain.selected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{domain.emoji}</span>
                    <span className="font-medium text-foreground">{domain.label}</span>
                  </button>
                ))}
              </div>
              <Button className="w-full mt-6" onClick={() => setStep(3)} disabled={!canContinue}>
                Continue <FiArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">You're all set, {name}!</h2>
              <p className="text-foreground-muted mb-6">
                Your Busy Bee dashboard is ready. Let's start achieving your goals!
              </p>
              <Button className="w-full">
                Go to Dashboard <FiArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Onboarding;
