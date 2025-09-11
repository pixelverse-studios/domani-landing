import validator from 'validator'

export function validateEmail(email: string): boolean {
  return validator.isEmail(email) && email.length <= 254
}

export function validateName(name: string): boolean {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-Z\s'-]+$/.test(name)
}

export function sanitizeInput(input: string): string {
  return validator.escape(input.trim())
}