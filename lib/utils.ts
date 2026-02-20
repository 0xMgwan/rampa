import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${random}`;
}

export function formatCurrency(amount: number, currencyCode: string, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function validatePhoneNumber(phone: string, pattern?: string): boolean {
  if (!pattern) return true;
  const regex = new RegExp(pattern);
  return regex.test(phone);
}

export function isValidAddress(address: string, network: string): boolean {
  if (network === 'TRC20') {
    return /^T[A-Za-z1-9]{33}$/.test(address);
  }
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
