import '@testing-library/jest-dom/vitest'

// Polyfill matchMedia for tests
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

class MockResizeObserver implements ResizeObserver {
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  observe(target: Element): void {
    const entry = {
      target,
      contentRect: {
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      },
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
    } as unknown as ResizeObserverEntry
    this.callback([entry], this)
  }
  unobserve(): void {}
  disconnect(): void {}
}

// @ts-expect-error - define ResizeObserver in test env
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  // @ts-expect-error - assign mock
  window.ResizeObserver = MockResizeObserver
}

if (typeof window !== 'undefined') {
  class MockImage {
    private _src = ''
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    set src(value: string) {
      this._src = value
      queueMicrotask(() => {
        this.onload?.()
      })
    }
    get src() {
      return this._src
    }
    set srcset(_value: string) {
      // noop
    }
    get srcset(): string {
      return ''
    }
  }

  // @ts-expect-error - override Image constructor for tests
  window.Image = MockImage as unknown as typeof Image
}
