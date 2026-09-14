import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["panel", "loadTime"]

  connect() {
    this.#handleOutsideClick = (e) => {
      if (!this.element.contains(e.target)) this.close()
    }
    this.#measureLoadTime()
  }

  toggle() {
    this.panelTarget.classList.toggle("hidden")
    if (!this.panelTarget.classList.contains("hidden")) {
      document.addEventListener("mousedown", this.#handleOutsideClick)
    } else {
      document.removeEventListener("mousedown", this.#handleOutsideClick)
    }
  }

  close() {
    this.panelTarget.classList.add("hidden")
    document.removeEventListener("mousedown", this.#handleOutsideClick)
  }

  #measureLoadTime() {
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0]
      if (nav) {
        const ms = Math.round(nav.loadEventEnd || nav.responseEnd)
        if (ms > 0) {
          this.loadTimeTarget.textContent = `${ms}ms`
          return
        }
      }
      // fallback: time since navigation start
      this.loadTimeTarget.textContent = `${Math.round(performance.now())}ms`
    }

    if (document.readyState === "complete") {
      measure()
    } else {
      window.addEventListener("load", measure, { once: true })
    }
  }

  #handleOutsideClick = null
}
