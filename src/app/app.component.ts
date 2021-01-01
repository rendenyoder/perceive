import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { settings } from './shared/utility/mode';
import { AppSettings } from './shared/utility/settings';
import { SearchState } from './shared/utility/search';
import { BibleService } from './shared/services/bible.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appSettings: AppSettings;
  searchState: SearchState;
  loaded = false;
  isSearchExpanded = false;
  showHelpInfo = false;
  isReadView = false;
  isHeaderHidden = false;
  modeSettings = settings;
  modes = Object.values(settings.modes);

  constructor(private changeDetector: ChangeDetectorRef, private bible: BibleService) { }

  ngOnInit() {
    this.load();
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

  /**
   * Sets up the application and initializes search state if applicable.
   */
  private load() {
    this.searchState = new SearchState(this.bible);
    // try and parse params if present
    let params = {};
    if (location.search) {
      params = this.parseQueryParams(location.search);
    }
    // set search term and read mode from params if present
    const query = params['query'];
    const mode = params['mode'];
    if (query) {
      this.searchState.searchTerm = query;
    }
    if (mode && this.modeSettings.modes[mode]) {
      this.modeSettings.current = mode;
    }
    // create effect if query and version params are not present
    const versions = params['version'];
    if (query && versions) {
      this.appSettings = new AppSettings(false);
    } else {
      this.appSettings = new AppSettings();
      this.loaded = true;
    }
    // fetch versions and setup search state from params if present
    this.searchState.fetchVersions().subscribe(() => {
      if (query && versions) {
        const selected = params['selected'];
        const limit = params['limit'];
        const offset = params['offset'];
        // load search state from params
        this.searchState.searchAndSelect(query, versions, selected, limit, offset).subscribe(_ => {
          this.display();
          this.loaded = true;
        }, error => {
          // TODO: Case where search fails.
        });
      }
    }, error => {
      // TODO: Case where search fails.
    });
  }

  /**
   * Parses query params from location search string.
   * @param location Location search string.
   */
  private parseQueryParams(location) {
    const params: {[key: string]: any} = {};
    const decoded = decodeURIComponent(location);
    decoded.substr(1).split('&').forEach(it => {
      if (it.includes('=')) {
        const key = it.split('=')[0];
        const value = it.split('=')[1];
        if (Array.isArray(params[key])) {
          params[key].push(value);
        } else if (!params[key]) {
          params[key] = value;
        } else {
          params[key] = [params[key]];
          params[key].push(value);
        }
      }
    });
    return params;
  }
}
