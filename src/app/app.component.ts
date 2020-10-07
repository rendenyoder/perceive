import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { settings } from './shared/model/mode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('appHeader', {static: false}) appHeader;

  @ViewChild('appSearch', {static: false}) appSearch;

  searchTerm = '';
  isSearchExpanded = false;
  hasSearched = false;
  showHelpInfo = false;
  isReadView = false;
  isHeaderHidden = false;
  searchResults = {};
  hasSearchResults = false;
  versionNames = [];
  modeSettings = settings;
  modes = Object.values(settings.modes);
  content = {};
  zoom = { factor: 1, step: 0.1, min: 1, max: 2 };

  effect;
  effectDelay = 50;
  effectInterval = 10;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.effect = window['VANTA'].WAVES({
      el: '#perceive',
      color: 0x9b9b9b,
      shininess: 25,
      waveHeight: 10,
      waveSpeed: 0.5,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
    });
  }

  /**
   * Sets the current search results from a search event.
   */
  setSearchResults($event) {
    const search = () => {
      this.hasSearched = true;
      this.isReadView = false;
      this.searchResults = {results: Array.from($event)};
      if (this.searchResults['results'] && this.searchResults['results'].length > 0) {
        this.hasSearchResults = this.searchResults['results'].some(item => {
          return item.results && (item.results.total || item.results.passages);
        });
        this.versionNames = this.searchResults['results'].map(res => res.name);
      }
    };
    // if effect still active, destroy then search
    if (this.effect) {
      this.destroyEffect(search);
    } else {
      search();
    }
  }

  /**
   * Displays the selected content.
   * @param $event The content to be displayed.
   */
  display($event) {
    this.isHeaderHidden = true;
    this.isReadView = true;
    this.content = $event;
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
    this.modeSettings.current = modeId;
    this.searchTerm = query;
    if (versions) {
      this.appHeader.selectVersions(...versions);
    }
    this.appHeader.doSearch(this.searchTerm, limit, offset).subscribe(res => {
      this.setSearchResults(res);
      // TODO: Really should not be calling detectChanges()...
      this.changeDetector.detectChanges();
      if (this.appSearch) {
        res.forEach(version => {
          if (version.results && version.results.verses) {
            version.results.verses.forEach(v => {
              if (!selected || selected.includes(v.id)) {
                this.appSearch.select(v, version, false);
              }
            });
          }
          if (version.results && version.results.passages) {
            version.results.passages.forEach(p => {
              if (!selected || selected.includes(p.id)) {
                this.appSearch.select(p, version, true);
              }
            });
          }
        });
        this.appSearch.displayResults();
      }
    });
  }

  /**
   * Increases the current zoom factor.
   */
  zoomIn() {
    if (this.zoom.factor < this.zoom.max) {
      this.zoom.factor += this.zoom.step;
    }
  }

  /**
   * Decreases the current zoom factor.
   */
  zoomOut() {
    if (this.zoom.factor > this.zoom.min) {
      this.zoom.factor -= this.zoom.step;
    }
  }

  /**
   * Updates the search term.
   * @param $event the new search term.
   */
  updateSearchTerm($event) {
    this.searchTerm = $event;
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
      this.hasSearched = true;
      this.isSearchExpanded = false;
    };
    // if effect still active, destroy then show help
    if (this.effect) {
      this.destroyEffect(help);
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
    this.scrollToElement($element, () => this.searchTerm = term);
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
   * Fades and destroys background effect.
   * Note: using for loop and setTimeout as apposed to setInterval as mobile safari
   * exhibits irregular behavior.
   */
  private destroyEffect(postAction) {
    const subtractionFactor = 1.0 / this.effectInterval;
    for (let i = 1; i <= this.effectInterval; i++) {
      setTimeout(() => {
        if (this.effect.renderer.domElement.style.opacity === '') {
          this.effect.renderer.domElement.style.opacity = 1.0 - subtractionFactor;
        } else {
          this.effect.renderer.domElement.style.opacity = this.effect.renderer.domElement.style.opacity - subtractionFactor;
        }
      }, this.effectDelay * i);
    }
    // guarantee effect destruction
    setTimeout(() => {
      this.effect.destroy();
      delete this.effect;
      postAction();
    }, this.effectDelay * this.effectInterval);
  }
}
