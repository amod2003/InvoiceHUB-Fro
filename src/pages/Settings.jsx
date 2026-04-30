import { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Save,
  Upload,
  Image as ImageIcon,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { CenterSpinner } from '../components/ui/Spinner';
import { tenantApi } from '../api/tenantApi';
import { apiErrorMessage } from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tenant, setTenant] = useState(null);

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(0);
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [paymentTerms, setPaymentTerms] = useState(30);

  const fillFromTenant = (t) => {
    setName(t.name || '');
    setCurrency(t.settings?.currency || 'USD');
    setTaxRate(t.settings?.tax_rate ?? 0);
    setInvoicePrefix(t.settings?.invoice_prefix || 'INV');
    setPaymentTerms(t.settings?.payment_terms ?? 30);
  };

  useEffect(() => {
    tenantApi
      .me()
      .then((t) => {
        setTenant(t);
        fillFromTenant(t);
      })
      .catch((err) => toast.error(apiErrorMessage(err, 'Failed to load settings')))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await tenantApi.update({
        name,
        settings: {
          currency,
          tax_rate: Number(taxRate),
          invoice_prefix: invoicePrefix,
          payment_terms: Number(paymentTerms),
        },
      });
      setTenant(updated);
      fillFromTenant(updated);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await tenantApi.uploadLogo(file);
      setTenant(updated);
      toast.success('Logo uploaded');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Upload failed'));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (loading) return <CenterSpinner />;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Plan banner */}
      <Card className="relative overflow-hidden p-6">
        <div className="absolute inset-0 ambient-glow opacity-50" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow-indigo">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest">Current Plan</p>
              <p className="text-lg font-semibold text-text-primary capitalize">
                {tenant?.plan || 'free'}
                <Badge dot className="ml-2 bg-status-success/10 text-emerald-300 border-status-success/30">
                  Active
                </Badge>
              </p>
            </div>
          </div>
          <Button variant="secondary">Upgrade Plan</Button>
        </div>
      </Card>

      {/* Workspace */}
      <Card>
        <CardHeader title="Workspace" subtitle="Update your business name and branding." />
        <CardBody className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Business name"
              icon={Building2}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Owner email"
              value={tenant?.email || ''}
              disabled
              hint="Set during registration."
            />
          </div>

          {/* Logo */}
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Logo
            </p>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-elevated border border-border-subtle">
              <div className="w-16 h-16 rounded-xl bg-bg-base border border-white/5 flex items-center justify-center overflow-hidden">
                {tenant?.settings?.logo_url ? (
                  <img src={tenant.settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-text-muted" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {tenant?.settings?.logo_url ? 'Replace logo' : 'Upload your logo'}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  PNG / JPG / SVG, square format works best.
                </p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              <Button
                variant="secondary"
                icon={Upload}
                loading={uploading}
                onClick={() => fileRef.current?.click()}
              >
                Choose File
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Invoice defaults */}
      <Card>
        <CardHeader title="Invoice Defaults" subtitle="Applied to every new invoice you create." />
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Default currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={[
              { value: 'USD', label: 'USD — US Dollar' },
              { value: 'INR', label: 'INR — Indian Rupee' },
              { value: 'EUR', label: 'EUR — Euro' },
              { value: 'GBP', label: 'GBP — British Pound' },
            ]}
          />
          <Input
            label="Default tax rate (%)"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          />
          <Input
            label="Invoice prefix"
            value={invoicePrefix}
            onChange={(e) => setInvoicePrefix(e.target.value)}
            hint="e.g. INV → INV-0001"
          />
          <Input
            label="Payment terms (days)"
            type="number"
            min="1"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
          />
        </CardBody>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader title="Your Account" subtitle="Profile information." />
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full name" value={user?.full_name || ''} disabled />
          <Input label="Email" value={user?.email || ''} disabled />
          <Input label="Role" value={user?.role || ''} disabled containerClassName="capitalize" />
        </CardBody>
      </Card>

      <div className="flex items-center justify-end gap-3 sticky bottom-4">
        <Button icon={Save} loading={saving} onClick={save}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
