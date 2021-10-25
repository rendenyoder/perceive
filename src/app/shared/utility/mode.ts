/**
 * Interface to represent a view mode.
 */
interface Mode {
  /**
   * Id of mode.
   */
  id: string;

  /**
   * Display name of the mode;
   */
  display: string;

  /**
   * Path to icon file.
   */
  icon: string;

  /**
   * Description of the mode.
   */
  description: string;

  /**
   * Query to be used in example.
   */
  query: string;

  /**
   * Versions to be used in example.
   */
  versions: Array<string>;
}

/**
 * Standard view mode.
 */
class StandardMode implements Mode {
  id = 'standard';
  display = 'Standard';
  icon = './assets/img/standard-view.png';
  description = 'The standard view displays verses, passages and chapters in a vertical orientation grouped by version';
  query = '(Psalm 32)';
  versions = ['de4e12af7f28f599-02'];
}

/**
 * Column view mode.
 */
class ColumnMode implements Mode {
  id = 'column';
  display = 'Column';
  icon = './assets/img/column-view.png';
  description = 'The column view displays verses, passages and chapters grouped by their book name, chapter and verse side by side';
  query = 'Psalm 32';
  versions = ['de4e12af7f28f599-02', '06125adad2d5898a-01'];
}

/**
 * Rotate view mode.
 */
class RotateMode implements Mode {
  id = 'rotate';
  display = 'Rotate';
  icon = './assets/img/rotate-view.png';
  description = 'The rotate view displays the first selected verse, passage or chapter and rotates through each selected verse, passage' +
    ' or chapter';
  query = 'Psalm 32';
  versions = ['de4e12af7f28f599-02', '06125adad2d5898a-01'];
}

/**
 * Mode settings.
 */
export const settings = {
  current: 'standard',
  modes: {
    standard: new StandardMode(),
    column: new ColumnMode(),
    rotate: new RotateMode(),
  }
};
