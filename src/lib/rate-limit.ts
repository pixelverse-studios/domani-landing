interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class SimpleRateLimit {
  private store: RateLimitStore = {}
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests = 5, windowMs = 60 * 60 * 1000) { // 5 requests per hour by default
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  async limit(identifier: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now()
    const record = this.store[identifier]

    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs
      }
      return { success: true, remaining: this.maxRequests - 1 }
    }

    if (record.count < this.maxRequests) {
      record.count++
      return { success: true, remaining: this.maxRequests - record.count }
    }

    return { success: false, remaining: 0 }
  }

  private cleanup() {
    const now = Date.now()
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    }
  }
}

export const rateLimit = new SimpleRateLimit()