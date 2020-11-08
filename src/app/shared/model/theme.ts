/**
 * Class to represent Vanta.js effect.
 */
abstract class VantaEffect {
  element: string;
  abstract config: object;
  abstract effect;
  abstract effectDelay: number;
  abstract effectInterval: number;

  constructor(element: string) {
    this.element = element;
  }

  /**
   * Creates vanta effect with props needed for specific effect.
   * @param prop Object to contain variables needed for effect.
   */
  abstract createEffect(prop: object);

  /**
   * Destroys vanta effect and runs post action.
   * @param postAction Call back function to run after destroying effect.
   */
  abstract destroyEffect(postAction: () => void);
}

/**
 * Vanta.js wave effect configuration.
 */
class WavesEffect extends VantaEffect {
  config = {
    el: this.element,
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
  };
  effect;
  effectDelay = 50;
  effectInterval = 10;

  createEffect(props: object) {
    this.config['color'] = props['color'] || 0x00000;
    this.effect = window['VANTA'].WAVES(this.config);
  }

  destroyEffect(postAction: () => void) {
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

/**
 * Represents a name/value property pair.
 */
class StyleProperty {
  property: string;
  value: string;

  constructor(property: string, value: any) {
    this.property = property;
    this.value = value;
  }
}

/**
 * Represents the theme accent property.
 */
class ThemeAccentProperty extends StyleProperty {
  hue: number;
  private readonly saturation;
  private readonly lightness;

  constructor(property: string, hue: number) {
    const saturation = 100;
    const lightness = 60;
    super(property, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
  }

  update(hue: number = this.hue) {
    this.value = `hsl(${hue}, ${this.saturation}%, ${this.lightness}%)`;
    this.hue = hue;
  }
}

/**
 * Abstract class representing a UI theme.
 */
abstract class Theme {
  abstract hueKey: string;
  abstract backgroundEffectColor: number;
  abstract iconFilter: StyleProperty;
  abstract themeAccent: ThemeAccentProperty;
  abstract fontColor: StyleProperty;
  abstract baseColor: StyleProperty;
  abstract darkAccent: StyleProperty;
  abstract midAccent: StyleProperty;
  abstract brightAccent: StyleProperty;

  /**
   * Gets stored hue value using hueKey.
   */
  getAccentHue() {
    const stored = localStorage.getItem(this.hueKey);
    return stored ? parseInt(stored, 10) : 0;
  }

  /**
   * Sets the accent hue.
   * @param hue The new accent hue.
   */
  setAccentHue(hue: number) {
    this.themeAccent.update(hue);
    this.setProp(this.themeAccent);
    localStorage.setItem(this.hueKey, hue.toString());
  }

  /**
   * Sets theme properties.
   */
  setStyleProperties() {
    this.setProp(this.iconFilter);
    this.setProp(this.themeAccent);
    this.setProp(this.fontColor);
    this.setProp(this.baseColor);
    this.setProp(this.darkAccent);
    this.setProp(this.midAccent);
    this.setProp(this.brightAccent);
  }

  setProp(styleProp: StyleProperty) {
    document.documentElement.style.setProperty(styleProp.property, styleProp.value);
  }
}

/**
 * Light UI theme.
 */
class LightTheme extends Theme {
  hueKey = 'light-accent-hue';
  backgroundEffectColor = 0x9b9b9b;
  iconFilter = new StyleProperty('--icon-filter', 'brightness(100%)');
  themeAccent = new ThemeAccentProperty('--theme-accent', this.getAccentHue());
  fontColor = new StyleProperty('--font-color', '#292929');
  baseColor = new StyleProperty('--base-color', '#f5f5f5');
  darkAccent = new StyleProperty('--dark-accent', '#9b9b9b');
  midAccent = new StyleProperty('--mid-accent', '#efefef');
  brightAccent = new StyleProperty('--bright-accent', '#ffffff');
}

/**
 * Dark UI theme.
 */
class DarkTheme extends Theme {
  hueKey = 'dark-accent-hue';
  backgroundEffectColor = 0x202020;
  iconFilter = new StyleProperty('--icon-filter', 'brightness(250%)');
  themeAccent = new ThemeAccentProperty('--theme-accent', this.getAccentHue());
  fontColor = new StyleProperty('--font-color', '#eaeaea');
  baseColor = new StyleProperty('--base-color', '#454545');
  darkAccent = new StyleProperty('--dark-accent', '#3c3c3c');
  midAccent = new StyleProperty('--mid-accent', '#484848');
  brightAccent = new StyleProperty('--bright-accent', '#515151');
}

/**
 * Contains app theme, including background effect and color theme.
 */
export class AppTheme {
  private themes = { light: new LightTheme(), dark: new DarkTheme() };
  private modeKey = 'mode';
  private effect = new WavesEffect('#perceive');
  private theme: Theme;
  mode: string = Object.keys(this.themes)[0];

  constructor() {
    this.mode = localStorage.getItem(this.modeKey) || this.mode;
    this.theme = this.themes[this.mode];
    this.theme.setStyleProperties();
    this.effect.createEffect({color: this.theme.backgroundEffectColor});
  }

  isEffectActive() {
    return Boolean(this.effect);
  }

  destroyEffect(postAction: () => void) {
    this.effect.destroyEffect(postAction);
    delete this.effect;
  }

  setTheme(mode: string) {
    const newTheme = this.themes[mode];
    if (newTheme) {
      this.mode = mode;
      this.theme = newTheme;
      this.theme.setStyleProperties();

      if (this.isEffectActive()) {
        this.effect.effect.destroy();
        delete this.effect.effect;
        this.effect.createEffect({color: this.theme.backgroundEffectColor});
      }

      localStorage.setItem(this.modeKey, this.mode);
    }
  }

  setThemeAccentHue(hue: number) {
    this.theme.setAccentHue(hue);
  }

  getThemeAccentHue() {
    return this.theme.getAccentHue();
  }
}
