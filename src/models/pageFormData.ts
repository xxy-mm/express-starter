class PageFormData {
  get hasError() {
    return Object.keys(this.errors).length > 0
  }
  constructor(
    public values: Record<string, any> = {},
    public errors: Record<string, string | undefined> = {},
  ) {}

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

export default PageFormData
