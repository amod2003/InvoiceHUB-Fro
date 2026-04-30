import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = typeof value === 'string' ? parseISO(value) : new Date(value);
  return isValid(d) ? d : null;
}

export function formatDate(value, pattern = 'MMM d, yyyy') {
  const d = toDate(value);
  return d ? format(d, pattern) : '—';
}

export function formatDateTime(value) {
  return formatDate(value, 'MMM d, yyyy · h:mm a');
}

export function formatRelative(value) {
  const d = toDate(value);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : '—';
}

export function toInputDate(value) {
  const d = toDate(value);
  return d ? format(d, 'yyyy-MM-dd') : '';
}

export function todayInput() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function addDaysInput(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return format(d, 'yyyy-MM-dd');
}
