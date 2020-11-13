import { DarkTheme, LightTheme, WavesEffect } from './theme';

/**
 * Contains app settings, including background effect and color theme.
 */
export class AppSettings {
  /**
   * Settings pertaining to app theme.
   */
  private theme = {
    selected: undefined,
    themes: {
      light: new LightTheme(),
      dark: new DarkTheme()
    },
    effect: {
      key: 'mode',
      mode: undefined,
      selected: new WavesEffect('#perceive')
    }
  };

  /**
   * Settings pertaining to read zoom level.
   */
  private zoom = {
    key: 'zoom',
    factor: 1,
    step: 0.1,
    min: 1,
    max: 2
  };

  constructor() {
    this.initTheme();
    this.initZoom();
  }

  /**
   * Initializes theme settings.
   */
  private initTheme() {
    this.theme.effect.mode = localStorage.getItem(this.theme.effect.key) || Object.keys(this.theme.themes)[0];
    this.theme.selected = this.theme.themes[this.theme.effect.mode];
    this.theme.selected.setStyleProperties();
    this.theme.effect.selected.createEffect({color: this.theme.selected.backgroundEffectColor});
  }

  /**
   * Initializes zoom settings.
   */
  private initZoom() {
    const zoomFactor = localStorage.getItem(this.zoom.key);
    this.zoom.factor = zoomFactor ? parseFloat(zoomFactor) : this.zoom.factor;
  }

  /**
   * Checks whether effect is currently active.
   */
  isEffectActive() {
    return Boolean(this.theme.effect.selected);
  }

  /**
   * Destroys effect and runs post action if provided.
   * @param postAction Action to run after destroying effect.
   */
  destroyEffect(postAction: () => void) {
    this.theme.effect.selected.destroyEffect(postAction);
    delete this.theme.effect.selected;
  }

  /**
   * Gets current theme mode.
   */
  getMode() {
    return this.theme.effect.mode;
  }

  /**
   * Sets theme from the provided mode value.
   * @param mode Key of theme.
   */
  setTheme(mode: string) {
    const newTheme = this.theme.themes[mode];
    if (newTheme) {
      this.theme.effect.mode = mode;
      this.theme.selected = newTheme;
      this.theme.selected.setStyleProperties();

      if (this.isEffectActive()) {
        this.theme.effect.selected.effect.destroy();
        delete this.theme.effect.selected.effect;
        this.theme.effect.selected.createEffect({color: this.theme.selected.backgroundEffectColor});
      }

      localStorage.setItem(this.theme.effect.key, this.theme.effect.mode);
    }
  }

  /**
   * Sets the theme's accent hue.
   * @param hue New accent hue.
   */
  setThemeAccentHue(hue: number) {
    this.theme.selected.setAccentHue(hue);
  }

  /**
   * Gets the theme's accent hue.
   */
  getThemeAccentHue() {
    return this.theme.selected.getAccentHue();
  }

  /**
   * Gets the current zoom factor.
   */
  getZoomFactor() {
    return this.zoom.factor;
  }

  /**
   * Increments zoom factor.
   */
  zoomIn() {
    if (this.zoom.factor < this.zoom.max) {
      this.zoom.factor += this.zoom.step;
      localStorage.setItem(this.zoom.key, this.zoom.factor.toString());
    }
  }

  /**
   * Decrements zoom factor.
   */
  zoomOut() {
    if (this.zoom.factor > this.zoom.min) {
      this.zoom.factor -= this.zoom.step;
      localStorage.setItem(this.zoom.key, this.zoom.factor.toString());
    }
  }
}
