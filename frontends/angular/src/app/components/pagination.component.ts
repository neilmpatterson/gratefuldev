import { Component, input, output } from '@angular/core'

const PAGE_SIZES = [15, 25, 50, 100]

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (pageCount() > 1 || pageSizes.indexOf(pageSize()) !== 0) {
      <div class="flex items-center justify-between mt-8 pt-4 border-t border-edge">
        <div class="flex items-center gap-2 text-sm text-muted">
          <span>Per page</span>
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

        @if (pageCount() > 1) {
          <div class="flex items-center gap-3">
            <button
              [disabled]="page() === 1"
              (click)="pageChange.emit(page() - 1)"
              class="px-3 py-1 rounded bg-surface border border-edge text-sm text-paper disabled:opacity-30 hover:border-accent hover:text-accent transition-colors"
            >←</button>
            <span class="text-sm text-muted tabular-nums">{{ page() }} / {{ pageCount() }}</span>
            <button
              [disabled]="page() === pageCount()"
              (click)="pageChange.emit(page() + 1)"
              class="px-3 py-1 rounded bg-surface border border-edge text-sm text-paper disabled:opacity-30 hover:border-accent hover:text-accent transition-colors"
            >→</button>
          </div>
        }
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
