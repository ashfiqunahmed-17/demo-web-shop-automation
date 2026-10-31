/**
 * Small dependency-free helpers for generating unique test data.
 * demowebshop requires a unique email per registration, so every run needs
 * fresh, non-colliding values.
 */

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Morgan', 'Riley', 'Casey', 'Jamie'];
const LAST_NAMES = ['Rahman', 'Chowdhury', 'Islam', 'Karim', 'Hasan', 'Ahmed', 'Khan', 'Hossain'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

export function uniqueSuffix(): string {
  return `${Date.now()}${randomInt(100, 999)}`;
}

export function randomEmail(): string {
  return `qa.autotest.${uniqueSuffix()}@mailinator.com`;
}

export function randomPassword(): string {
  return `TestPass!${randomInt(1000, 9999)}`;
}

export interface NewCustomer {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function randomCustomer(): NewCustomer {
  return {
    firstName: pick(FIRST_NAMES),
    lastName: pick(LAST_NAMES),
    email: randomEmail(),
    password: randomPassword(),
  };
}

export const guestBillingAddress = {
  firstName: pick(FIRST_NAMES),
  lastName: pick(LAST_NAMES),
  email: randomEmail(),
  country: 'United States',
  city: 'New York',
  address1: '123 QA Automation Street',
  zip: '10001',
  phone: '5551234567',
};
