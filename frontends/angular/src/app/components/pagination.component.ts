import { Component, input, output } from '@angular/core'

const PAGE_SIZES = [15, 25, 50, 100]

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (pageCount() > 1) {
      <div class="flex items-center justify-between mt-8 text-sm">
        <div class="flex items-center gap-1">
          <button
            (click)="pageChange.emit(page() - 1)"
            [disabled]="page() === 1"
            class="px-3 py-1.5 rounded border border-edge text-muted hover:text-paper hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          <span class="px-4 text-muted tabular-nums">
            {{ page() }} / {{ pageCount() }}
          </span>
          <button
            (click)="pageChange.emit(page() + 1)"
            [disabled]="page() === pageCount()"
            class="px-3 py-1.5 rounded border border-edge text-muted hover:text-paper hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>

        <div class="flex items-center gap-2 text-muted">
          <span>per page</span>
          <select
            [value]="pageSize()"
            (change)="pageSizeChange.emit(+$any($event.target).value)"
            class="bg-surface border border-edge rounded px-2 py-1 text-sm text-paper focus:outline-none focus:border-accent"
          >
            @for (n of pageSizes; track n) {
              <option [value]="n">{{ n }}</option>
            }
          </select>
        </div>
      </div>
    }
  `,
})
export class PaginationComponent {
  readonly page = input.required<number>()
  readonly pageCount = input.required<number>()
  readonly pageSize = input.required<number>()

  readonly pageChange = output<number>()
  readonly pageSizeChange = output<number>()

  readonly pageSizes = PAGE_SIZES
}
