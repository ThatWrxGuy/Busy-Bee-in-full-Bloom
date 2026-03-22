/**
 * Busy Bee Billing - Design System Implementation
 */

import { useState } from 'react';
import { FiCreditCard, FiDownload, FiPlus, FiTrash2 } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Grid,
  Badge,
} from '../components';

const INVOICES = [
  { id: 1, date: '2024-01-15', amount: 12.0, status: 'paid' },
  { id: 2, date: '2023-12-15', amount: 12.0, status: 'paid' },
  { id: 3, date: '2023-11-15', amount: 12.0, status: 'paid' },
];

const PAYMENT_METHODS = [{ id: 1, type: 'visa', last4: '4242', exp: '12/25', default: true }];

function Billing() {
  const [loading, setLoading] = useState(null);

  return (
    <PageContainer title="Billing" subtitle="Manage your payments and invoices">
      {/* Current Plan */}
      <Card className="mb-6">
        <CardHeader title="Current Plan" />
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">Pro Plan</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-foreground-muted">$12/month • Next billing: Feb 15, 2024</p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>

      <Grid cols={{ default: 1, lg: 2 }} className="gap-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader
            title="Payment Methods"
            action={
              <Button size="sm">
                <FiPlus className="w-4 h-4 mr-1" /> Add
              </Button>
            }
          />
          <CardContent className="space-y-4">
            {PAYMENT_METHODS.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded">
                    <FiCreditCard className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground capitalize">
                      {pm.type} •••• {pm.last4}
                    </p>
                    <p className="text-sm text-foreground-muted">Expires {pm.exp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pm.default && <Badge variant="outline">Default</Badge>}
                  <Button variant="ghost" size="sm">
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader title="Billing History" />
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-foreground">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-foreground">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-foreground">Status</th>
                  <th className="text-right p-3 text-sm font-medium text-foreground">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {INVOICES.map((inv) => (
                  <tr key={inv.id}>
                    <td className="p-3 text-foreground">{inv.date}</td>
                    <td className="p-3 text-foreground">${inv.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <Badge variant="success">{inv.status}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm">
                        <FiDownload className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Grid>
    </PageContainer>
  );
}

export default Billing;
