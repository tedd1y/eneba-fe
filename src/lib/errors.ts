/** Thrown by query functions when the API answers 404, so pages can render a not-found state. */
export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}
