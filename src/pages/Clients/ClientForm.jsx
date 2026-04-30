import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, User, Mail, Phone, Building2, Hash } from 'lucide-react';

import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { CenterSpinner } from '../../components/ui/Spinner';
import { clientApi } from '../../api/clientApi';
import { apiErrorMessage } from '../../api/axiosInstance';

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  gstin: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  address: z
    .object({
      line1: z.string().optional().or(z.literal('')),
      city: z.string().optional().or(z.literal('')),
      state: z.string().optional().or(z.literal('')),
      postal_code: z.string().optional().or(z.literal('')),
      country: z.string().optional().or(z.literal('')),
    })
    .optional(),
});

export default function ClientForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      gstin: '',
      notes: '',
      address: { line1: '', city: '', state: '', postal_code: '', country: '' },
    },
  });

  useEffect(() => {
    if (!isEdit) return;
    clientApi
      .get(id)
      .then((c) => {
        reset({
          name: c.name || '',
          email: c.email || '',
          phone: c.phone || '',
          company: c.company || '',
          gstin: c.gstin || '',
          notes: c.notes || '',
          address: {
            line1: c.address?.line1 || '',
            city: c.address?.city || '',
            state: c.address?.state || '',
            postal_code: c.address?.postal_code || '',
            country: c.address?.country || '',
          },
        });
      })
      .catch((err) => toast.error(apiErrorMessage(err, 'Failed to load client')))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const payload = {
      ...data,
      phone: data.phone || null,
      company: data.company || null,
      gstin: data.gstin || null,
      notes: data.notes || null,
      address: data.address && Object.values(data.address).some(Boolean) ? data.address : null,
    };
    try {
      if (isEdit) {
        await clientApi.update(id, payload);
        toast.success('Client updated');
      } else {
        await clientApi.create(payload);
        toast.success('Client created');
      }
      navigate('/clients');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Save failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CenterSpinner />;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        to="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to clients
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader title="Contact Details" subtitle="Primary information for invoicing." />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full name"
              icon={User}
              placeholder="Jane Doe"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="jane@client.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Phone"
              icon={Phone}
              placeholder="+1 555 123 4567"
              {...register('phone')}
            />
            <Input
              label="Company"
              icon={Building2}
              placeholder="Acme Corp"
              {...register('company')}
            />
            <Input
              label="GSTIN / Tax ID"
              icon={Hash}
              placeholder="22AAAAA0000A1Z5"
              containerClassName="md:col-span-2"
              {...register('gstin')}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Billing Address" subtitle="Used on the invoice." />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Address line"
              placeholder="123 Market St"
              containerClassName="md:col-span-2"
              {...register('address.line1')}
            />
            <Input label="City" placeholder="San Francisco" {...register('address.city')} />
            <Input label="State / Region" placeholder="CA" {...register('address.state')} />
            <Input label="Postal code" placeholder="94105" {...register('address.postal_code')} />
            <Input label="Country" placeholder="USA" {...register('address.country')} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Notes" subtitle="Internal notes — not shown on the invoice." />
          <CardBody>
            <Textarea rows={4} placeholder="Anything to remember about this client…" {...register('notes')} />
          </CardBody>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate('/clients')}>
            Cancel
          </Button>
          <Button type="submit" icon={Save} loading={submitting}>
            {isEdit ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>
      </form>
    </div>
  );
}
