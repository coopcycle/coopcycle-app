export default class DropdownHolder {
  static dropdown;

  static setDropdown(dropdown) {
    this.dropdown = dropdown;
  }

  static getDropdown() {
    return this.dropdown;
  }
}
