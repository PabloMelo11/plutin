type Rule<T> = (value: T) => string | null

type FieldValidator<V> = {
  notEmpty(message?: string): Validator<any>
  isEmail(message?: string): Validator<any>
  min(value: number, message?: string): Validator<any>
  custom(rule: Rule<V>): Validator<any>
}

export class Validator<T extends Record<string, any>> {
  private dto: T
  private errors: string[] = []

  constructor(dto: T) {
    this.dto = dto
  }

  check<K extends keyof T>(field: K): FieldValidator<T[K]> {
    const value = this.dto[field]

    const addError = (message: string) => {
      this.errors.push(message)
    }

    return {
      notEmpty: (msg = `${String(field)} is required`) => {
        if (value.trim() === '' || value === null || value === undefined) {
          addError(msg)
        }
        return this
      },
      isEmail: (msg = `${String(field)} must be a valid email`) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!regex.test(value)) {
          addError(msg)
        }
        return this
      },
      min: (
        minValue: number,
        msg = `${String(field)} must be at least ${minValue}`
      ) => {
        if (value < minValue) {
          addError(msg)
        }
        return this
      },
      custom: (rule: Rule<T[K]>) => {
        const result = rule(value)
        if (result) addError(result)
        return this
      },
    }
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }

  getErrors(): string[] {
    return this.errors
  }

  validate(): { success: true } | { success: false; errors: string[] } {
    return this.hasErrors()
      ? { success: false, errors: this.getErrors() }
      : { success: true }
  }
}
