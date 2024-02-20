export const setUserSession = (
  user: { _id: string; password: string },
  session?: Record<string, any> | null,
) => {
  if (!session) {
    throw new Error('no session middleware provided')
  }
  session!.user = user
}
