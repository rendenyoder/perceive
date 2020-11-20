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

  constructor() {
    this.initTheme();
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
   * Increments zoom factor.
   */
  zoomIn() {
    this.theme.selected.zoomIn();
  }

  /**
   * Decrements zoom factor.
   */
  zoomOut() {
    this.theme.selected.zoomOut();
  }
}
