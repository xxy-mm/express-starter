import { toFormDate } from './date'
import randomToken from './randomToken'
import renderPage from './renderPage'
import { setUserSession } from './setUserSession'

describe('utils', () => {
  describe('toFormDate', () => {
    it('returns the correct date string', () => {
      const date = new Date(2024, 1, 20)
      const formDate = toFormDate(date)

      expect(formDate).toBe('2024-02-20')
    })
  })

  describe('randomToken', () => {
    it('returns a non empty string', () => {
      expect(randomToken().length).toBeGreaterThan(0)
    })
    it('returns different string each time it is called', () => {
      expect(randomToken()).not.toBe(randomToken())
    })
  })

  describe('setUserSession', () => {
    const mockUser = { _id: '123', password: 'abc' }
    it('throws error when session is null or undefined', () => {
      expect(() => setUserSession(mockUser, null)).toThrow()
      expect(() => setUserSession(mockUser)).toThrow()
    })

    it('sets user session correctly', () => {
      const mockSession: { user?: unknown } = {}
      setUserSession(mockUser, mockSession)

      expect(mockSession?.user).toEqual(mockUser)
    })
  })

  // hard to write test unless decoupled from express.request and response
  describe('renderPage', () => {
    const renderFn = jest.fn()
    const options = {
      title: 'test',
      test: true,
    }
    const mockSession = { user: { _id: '1', password: '2' } }
    it('calls renderFn with correct params', () => {
      renderPage('test', options)(renderFn, mockSession)

      expect(renderFn).toHaveBeenCalledTimes(1)
      expect(renderFn).toHaveBeenCalledWith('test', {
        ...options,
        user: mockSession.user,
      })
    })
  })
})
