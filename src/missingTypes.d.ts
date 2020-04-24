declare var VERSION: string;
declare var ASSETS: string[];

declare namespace Intl {
  interface NumberFormatOptions {
    unit?: 'acre' | 'bit' | 'byte' | 'celsius' | 'centimeter' | 'day' | 'degree' | 'fahrenheit' | 'fluid-ounce' | 'foot' | 'gallon' | 'gigabit' | 'gigabyte' | 'gram' | 'hectare' | 'hour' | 'inch' | 'kilobit' | 'kilobyte' | 'kilogram' | 'kilometer' | 'liter' | 'megabit' | 'megabyte' | 'meter' | 'mile' | 'mile-scandinavian' | 'milliliter' | 'millimeter' | 'millisecond' | 'minute' | 'month' | 'ounce' | 'percent' | 'petabyte' | 'pound' | 'second' | 'stone' | 'terabit' | 'terabyte' | 'week' | 'yard' | 'year';
    unitDisplay?: 'long' | 'short' | 'narrow';
  }
}
