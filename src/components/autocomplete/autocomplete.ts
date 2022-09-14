import { html, LitElement, CSSResultGroup } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import '../dropdown/dropdown';
import '../menu/menu';
import '../menu-item/menu-item';
import type SlDropdown from '../dropdown/dropdown';
import type SlInput from '../input/input';
import type SlMenu from '../menu/menu';
import type SlMenuItem from '../menu-item/menu-item';

import styles from './autocomplete.styles';
import { styleMap } from 'lit/directives/style-map.js';
import { HasSlotController } from '../../internal/slot';

const escapeRegExp = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

@customElement('sl-autocomplete')
export default class SlAutocomplete extends LitElement {
  static styles: CSSResultGroup = styles;

  @query('sl-menu') menu: SlMenu;
  @query('sl-dropdown') dropdown: SlDropdown;
  @query('slot:not([name])') defaultSlot: HTMLSlotElement;

  private readonly hasSlotController = new HasSlotController(this, 'loading-text', 'empty-text');

  @state() private value: string = '';
  @state() private hasFocus: boolean = false;

  @property({ type: String, reflect: true }) emptyText: String;

  @property({ type: Boolean, reflect: true }) loading: Boolean = false;

  @property({ type: String, reflect: true }) loadingText: String;

  @property({ type: Boolean, reflect: true }) autofilter: Boolean = false;

  @property({ type: Boolean, reflect: true }) highlight: Boolean = false;

  @property({ type: Number, reflect: true }) threshold: number = 1;

  handleSlInput(event: CustomEvent) {
    const { value } = event.target as SlInput;

    if (this.autofilter) {
      this.options.forEach(option => {
        const shouldDisplay = new RegExp(`(${escapeRegExp(value ?? '')})`, 'ig').test(option.getTextLabel());

        if (shouldDisplay) {
          option.style.display = 'block';
          option.disabled = false;
          option.ariaHidden = 'false';
        } else {
          option.style.display = 'none';
          option.disabled = true;
          option.ariaHidden = 'true';
        }
      });
    }

    this.hasFocus = true;
    this.value = value;
  }

  handleKeydown(event: KeyboardEvent) {
    if (!this.shouldDisplayAutoComplete || event.ctrlKey || event.metaKey) {
      return;
    }

    const options = this.visibleOptions;

    if (options.length === 0) {
      return;
    }

    const firstItem = options[0];
    const lastItem = options[options.length - 1];

    switch (event.key) {
      case 'Tab':
      case 'Escape':
        this.hasFocus = false;
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.menu.setCurrentItem(firstItem);
        firstItem.focus();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.menu.setCurrentItem(lastItem);
        lastItem.focus();
        break;
    }
  }

  handleSlFocus(_event: CustomEvent) {
    if (this.value.length >= this.threshold) {
      this.hasFocus = true;
      this.show();
    }
  }

  handleSlAfterHide(_event: CustomEvent) {
    this.hasFocus = false;
  }

  show() {
    this.dropdown?.show();
  }

  hide() {
    this.dropdown?.hide();
  }

  reset() {
    this.value = '';
  }

  get options(): SlMenuItem[] {
    return (this.defaultSlot?.assignedElements() || []) as SlMenuItem[];
  }

  get visibleOptions() {
    return this.options.filter(option => option.style.display !== 'none');
  }

  get hasResults() {
    return this.visibleOptions.length > 0;
  }

  get shouldDisplayLoadingText() {
    return this.loading && (this.loadingText || this.hasSlotController.test('loading-text'));
  }

  get shouldDisplayEmptyText() {
    return !this.hasResults && (this.emptyText || this.hasSlotController.test('empty-text'));
  }

  get shouldDisplayAutoComplete() {
    return (
      this.hasFocus &&
      ((this.value.length >= this.threshold && this.hasResults) || this.shouldDisplayLoadingText || this.shouldDisplayEmptyText)
    );
  }

  render() {
    const { shouldDisplayLoadingText } = this

    return html`
      <div part="base">
        <div
          part="trigger"
          @sl-focus=${this.handleSlFocus}
          @sl-input=${this.handleSlInput}
          @keydown=${this.handleKeydown}
        >
          <slot name="trigger"></slot>
        </div>

        <sl-dropdown ?open=${this.shouldDisplayAutoComplete} @sl-after-hide=${this.handleSlAfterHide}>
          <sl-menu>
            <slot
              aria-hidden=${shouldDisplayLoadingText ? 'true' : 'false'}
              style="${styleMap({ display: shouldDisplayLoadingText ? 'none' : 'block' })}"
            >
            </slot>

            <div
              part="loading-text"
              id="loading-text"
              class="loading-text"
              aria-hidden=${shouldDisplayLoadingText ? 'false' : 'true'}
              style="${styleMap({ display: shouldDisplayLoadingText ? 'block' : 'none' })}"
            >
              <slot name="loading-text">${this.loadingText}</slot>
            </div>

            <div
              part="empty-text"
              id="empty-text"
              class="empty-text"
              aria-hidden=${this.shouldDisplayEmptyText ? 'false' : 'true'}
              style="${styleMap({ display: this.shouldDisplayEmptyText ? 'block' : 'none' })}"
            >
              <slot name="empty-text">${this.emptyText}</slot>
            </div>

            <div aria-hidden="true" style=${styleMap({ width: `${this.clientWidth}px` })}></div>
          </sl-menu>
        </sl-dropdown>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-autocomplete': SlAutocomplete;
  }
}
