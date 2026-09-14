import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form"]

  #timer = null

  submit() {
    clearTimeout(this.#timer)
    this.#timer = setTimeout(() => this.element.requestSubmit(), 300)
  }
}
