import randomToken from '../utils/randomToken'

class SessionForm {
  public static create(
    values: Record<string, any> = {},
    errors: Record<string, string | undefined> = {},
  ) {
    return new SessionForm(values, errors)
  }
  get hasError() {
    return Object.keys(this.errors).length > 0
  }
  constructor(
    public values: Record<string, any> = {},
    public errors: Record<string, string | undefined> = {},
  ) {}

  addSessionToken(session?: Record<string, any> | null) {
    if (!session) {
      throw new Error('no session middleware provided')
    }
    const token = randomToken()
    this.values.token = token
    session!.token = this.values.token
    return this
  }
  complete(session?: Record<string, any> | null) {
    session && (session.token = null)
  }
  getClass = (name: string) => {
    const classes =
      this.errors[name] && this.values[name]
        ? { input: 'is-invalid', feedback: 'invalid-feedback' }
        : {}
    return classes
  }

  // setValue(field: string, value: any) {
  //   this.values[field] = value
  // }
  // setError(field: string, message: string) {
  //   this.errors[field] = message
  // }
  // setHasError(hasError: boolean) {
  //   if (!this.hasError) {
  //     this.hasError = true
  //   }
  // }

  // getValue(field: string) {
  //   return this.values[field]
  // }
  // getError(field: string) {
  //   return this.errors[field]
  // }

  // getHasError() {
  //   return this.hasError
  // }
}

export default SessionForm
