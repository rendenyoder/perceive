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
 * Abstract class representing a UI theme.
 */
abstract class Theme {
  name: string;
  backgroundEffectColor: number;
  themeAccent: StyleProperty;
  fontColor: StyleProperty;
  baseColor: StyleProperty;
  darkAccent: StyleProperty;
  midAccent: StyleProperty;
  brightAccent: StyleProperty;

  /**
   * Sets theme properties.
   */
  setStyleProperties() {
    this.setProp(this.themeAccent);
    this.setProp(this.fontColor);
    this.setProp(this.baseColor);
    this.setProp(this.darkAccent);
    this.setProp(this.midAccent);
    this.setProp(this.brightAccent);
  }

  private setProp(styleProp: StyleProperty) {
    document.documentElement.style.setProperty(styleProp.property, styleProp.value);
  }
}

/**
 * Light UI theme.
 */
export class LightTheme extends Theme {
  name = 'light';
  backgroundEffectColor = 0x9b9b9b;
  themeAccent = new StyleProperty('--theme-accent', '#fc4040');
  fontColor = new StyleProperty('--font-color', '#292929');
  baseColor = new StyleProperty('--base-color', '#f5f5f5');
  darkAccent = new StyleProperty('--dark-accent', '#9b9b9b');
  midAccent = new StyleProperty('--mid-accent', '#efefef');
  brightAccent = new StyleProperty('--bright-accent', '#ffffff');
}

/**
 * Dark UI theme.
 */
export class DarkTheme extends Theme {
  name = 'dark';
  backgroundEffectColor = 0x202020;
  themeAccent = new StyleProperty('--theme-accent', '#fc4040');
  fontColor = new StyleProperty('--font-color', '#eaeaea');
  baseColor = new StyleProperty('--base-color', '#454545');
  darkAccent = new StyleProperty('--dark-accent', '#3c3c3c');
  midAccent = new StyleProperty('--mid-accent', '#484848');
  brightAccent = new StyleProperty('--bright-accent', '#515151');
}
