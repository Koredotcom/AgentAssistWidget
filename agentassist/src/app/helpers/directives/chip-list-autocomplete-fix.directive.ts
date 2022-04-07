import {AfterContentInit, ContentChild, Directive, QueryList, ViewContainerRef} from '@angular/core';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatChip, MatChipList} from '@angular/material/chips';


/**
 * This directive fixes the Material Chip List Autocomplete issue where if you click an option in the autocomplete menu,
 * the panel doesn't return unless you click out and click back in again.
 *
 * Keaton Burleson 
 */
@Directive({
  selector: '[chipListAutocompleteFix]'
})
export class ChipListAutocompleteFixDirective implements AfterContentInit {

  // Use ContentChild decorator to get the MatAutocomplete component and the MatAutoCompleteTrigger component
  @ContentChild(MatChipList) chipList: MatChipList;
  @ContentChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) input: MatAutocompleteTrigger;

  // Keep track of the raw input inside of the MatFormField
  private rawInput: HTMLInputElement;
  private chipCount = 0;

  /**
   * Constructor
   *
   * @param _viewContainerRef - We need this to fetch the raw input element from inside of the MatFormField
   */
  constructor(private _viewContainerRef: ViewContainerRef) {
  }


  /**
   * This function runs after the content has been displayed.
   * This is important to make sure all the DOM rendering is finished for the Material components
   */
  ngAfterContentInit(): void {
    if (!this.rawInput) {
      // Query our input element directly
      this.rawInput = this._viewContainerRef.element.nativeElement.querySelector('input');
    }

    // Watch for changes on the Chip List
    this.chipList.chips.changes.subscribe((changes: QueryList<MatChip>) => {
      const currentChipCount = changes.length;

      // Check if we're adding or removing a chip to toggle input
      if (currentChipCount < this.chipCount || currentChipCount > this.chipCount) {
        this.toggleInput();
      }

      // Update chip count
      this.chipCount = currentChipCount;
    });

  }

  /**
   * This function sets the search value of the autocomplete to a blank string then opens the panel again
   *
   * @private
   */
  private toggleInput() {
    if (!!this.input && !!this.rawInput) {
      this.rawInput.value = '';

      // NOTE: setTimeout() is required to trigger a change quickly in e DOM
      setTimeout(() => this.input.openPanel(), 0);
      return;
    }

    console.warn('You have not supplied a valid value for autocompleteInput. The fix will not work');
  }

}