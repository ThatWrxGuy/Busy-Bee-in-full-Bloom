/**
 * Busy Bee Help - Design System Implementation
 */

import { useState } from 'react';
import { FiSearch, FiBook, FiMessageCircle, FiMail, FiExternalLink } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
} from '../components';

const FAQS = [
  {
    q: 'How do I create a new goal?',
    a: 'Click the "New Goal" button on the Goals page and fill in the details.',
  },
  {
    q: 'How does the domain system work?',
    a: 'Domains help you organize your goals into different life areas like Health, Career, etc.',
  },
  {
    q: 'Can I track my progress over time?',
    a: 'Yes! Check the Analytics page for detailed insights into your performance.',
  },
  {
    q: 'How do I connect my accounts?',
    a: 'Go to Settings > Data > Link Account to connect your financial accounts.',
  },
];

function Help() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  return (
    <PageContainer title="Help Center" subtitle="Find answers and get support">
      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-8">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
        <input
          type="text"
          placeholder="Search for help..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: FiBook, label: 'Documentation', desc: 'Learn how to use Busy Bee' },
          { icon: FiMessageCircle, label: 'Community', desc: 'Ask questions and get help' },
          { icon: FiMail, label: 'Contact', desc: 'Reach out to our support team' },
        ].map((item, i) => (
          <Card key={i} hover className="cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-foreground-muted">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader title="Frequently Asked Questions" />
        <CardContent className="p-0">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-border last:border-0">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-secondary/30"
              >
                <span className="font-medium text-foreground">{faq.q}</span>
                <FiExternalLink
                  className={`w-4 h-4 text-foreground-muted transition-transform ${expanded === i ? 'rotate-90' : ''}`}
                />
              </button>
              {expanded === i && <div className="px-4 pb-4 text-foreground-muted">{faq.a}</div>}
            </div>
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default Help;
