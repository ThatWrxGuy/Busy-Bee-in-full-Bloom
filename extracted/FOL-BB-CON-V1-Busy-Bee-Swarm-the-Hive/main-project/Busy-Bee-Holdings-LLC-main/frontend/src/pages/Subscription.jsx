/**
 * Busy Bee Subscription - Design System Implementation
 */

import { useState } from 'react';
import { FiCheck, FiZap } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Grid,
} from '../components';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['Basic goal tracking', '3 life domains', 'Weekly analytics', 'Community support'],
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    period: '/month',
    features: [
      'Unlimited goals',
      'All life domains',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
      'API access',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    features: [
      'Everything in Pro',
      'Team management',
      'SSO integration',
      'Custom branding',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
];

function Subscription() {
  const [loading, setLoading] = useState(null);

  const handleSubscribe = (planId) => {
    setLoading(planId);
    setTimeout(() => setLoading(null), 1000);
  };

  return (
    <PageContainer title="Subscription" subtitle="Choose the right plan for you">
      <Grid cols={{ default: 1, md: 3 }} className="gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <FiZap className="w-3 h-3" /> Most Popular
                </span>
              </div>
            )}
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-foreground-muted">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <FiCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.current ? 'outline' : plan.popular ? 'default' : 'outline'}
                className="w-full"
                disabled={plan.current}
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.current
                  ? 'Current Plan'
                  : loading === plan.id
                    ? 'Processing...'
                    : 'Subscribe'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </PageContainer>
  );
}

export default Subscription;
