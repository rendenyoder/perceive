import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { settings } from './shared/model/mode';
import { AppSettings } from './shared/model/settings';
import { SearchState } from './shared/model/search';
import { BibleService } from './shared/services/bible.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appSettings: AppSettings;
  searchState: SearchState;
  isSearchExpanded = false;
  showHelpInfo = false;
  isReadView = false;
  isHeaderHidden = false;
  modeSettings = settings;
  modes = Object.values(settings.modes);

  constructor(private changeDetector: ChangeDetectorRef, private bible: BibleService) { }

  ngOnInit() {
    this.appSettings = new AppSettings();
    this.searchState = new SearchState(this.bible);
  }

  /**
   * After search, destroy effect and show results or show error.
   */
  search($event) {
    if ($event) {
      const view = () => this.isReadView = false;
      // if effect still active, destroy then run post action
      if (this.appSettings.isEffectActive()) {
        this.appSettings.destroyEffect(view);
      } else {
        view();
      }
    } else {
      // TODO: Case where search fails.
    }
  }

  /**
   * Displays the selected content.
   * @param $event The content to be displayed.
   */
  display() {
    this.isHeaderHidden = true;
    this.isReadView = true;
  }

  /**
   * Opens content in the specified read view.
   * @param modeId The view mode to open content in.
   * @param query The search query to use.
   * @param versions The version to search from.
   * @param selected The selected passages or verses. Undefined will be interpreted as select all.
   * @param limit The number of results to fetch.
   * @param offset The offset of results.
   */
  openContent(modeId, query, versions, selected?, limit?, offset?) {
    this.searchState.searchAndSelect(query, versions, selected, limit, offset).subscribe(results => {
      this.modeSettings.current = modeId;
      window.scroll(0, 0);
      this.display();
    }, error => {
      // TODO: Case where search fails.
    });
  }

  /**
   * Updates the state of the search settings expanded flag.
   * @param $event the new state.
   */
  updateSearch($event) {
    this.isSearchExpanded = $event;
  }

  /**
   * Closes the current content view.
   */
  close() {
    this.isHeaderHidden = false;
    this.isReadView = false;
  }

  /**
   * Show help info.
   */
  showHelp() {
    const help = () => {
      this.showHelpInfo = true;
      this.searchState.hasSearched = true;
      this.isSearchExpanded = false;
    };
    // if effect still active, destroy then show help
    if (this.appSettings.isEffectActive()) {
      this.appSettings.destroyEffect(help);
    } else {
      help();
    }
  }

  /**
   * Scrolls view to the updated element and updates search term.
   * @param $element the updated element.
   * @param term the new search term.
   */
  scrollSearchTerm($element, term) {
    this.isSearchExpanded = false;
    this.scrollToElement($element, () => this.searchState.searchTerm = term);
  }

  /**
   * Scrolls view to the updated element and updates search expanded state.
   * @param $element the updated element.
   * @param state the new search expanded state.
   */
  scrollSearchExpand($element, state) {
    this.scrollToElement($element, () => this.isSearchExpanded = state);
  }

  /**
   * Scrolls to given element.
   * @param $element the element to scroll to.
   */
  private scrollToElement($element, lambda): void {
    $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    setTimeout(() => lambda(), 150);
  }
}
