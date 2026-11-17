/** Thrown by query functions when the API answers 404, so pages can render a not-found state. */
export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

/**
 * A failed API call, with a message that's safe to show and, for 422 validation errors,
 * the first message per field (e.g. `fieldErrors.email`) so forms can show them inline.
 */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(status: number, body: unknown, fallback: string) {
    const { message, errors } = (body && typeof body === 'object' ? body : {}) as {
      message?: string
      errors?: Record<string, string[] | string>
    }
    const fieldErrors = Object.fromEntries(
      Object.entries(errors ?? {}).map(([field, list]) => [field, Array.isArray(list) ? list[0] : list]),
    )
    super(Object.values(fieldErrors)[0] ?? message ?? fallback)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}
