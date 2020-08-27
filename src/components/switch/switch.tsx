import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch, h } from '@stencil/core';
import { hasSlot } from '../../utilities/slot';

let id = 0;

/**
 * @since 2.0
 * @status stable
 *
 * @slot - The switch's label.
 * @slot prefix - An optional label to display before the switch.
 *
 * @part base - The component's base wrapper.
 * @part control - The switch control.
 * @part thumb - The switch position indicator.
 * @part label - The switch label.
 */

@Component({
  tag: 'sl-switch',
  styleUrl: 'switch.scss',
  shadow: true
})
export class Switch {
  switchId = `switch-${++id}`;
  labelId = `switch-label-${id}`;
  input: HTMLInputElement;

  @Element() host: HTMLSlSwitchElement;

  @State() hasFocus = false;
  @State() hasPrefix = false;

  /** The switch's name attribute. */
  @Prop() name: string;

  /** The switch's value attribute. */
  @Prop() value: string;

  /** Set to true to disable the switch. */
  @Prop() disabled = false;

  /** Set to true to draw the switch in a checked state. */
  @Prop({ mutable: true, reflect: true }) checked = false;

  @Watch('checked')
  handleCheckedChange() {
    this.input.checked = this.checked;
    this.slChange.emit();
  }

  /** Emitted when the control loses focus. */
  @Event() slBlur: EventEmitter;

  /** Emitted when the control's checked state changes. */
  @Event() slChange: EventEmitter;

  /** Emitted when the control gains focus. */
  @Event() slFocus: EventEmitter;

  connectedCallback() {
    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleLabelClick = this.handleLabelClick.bind(this);
    this.handlePrefixClick = this.handlePrefixClick.bind(this);
    this.updateSlots = this.updateSlots.bind(this);
  }

  componentWillLoad() {
    this.updateSlots();
    this.host.shadowRoot.addEventListener('slotchange', this.updateSlots);
  }

  disconnectedCallback() {
    this.host.shadowRoot.removeEventListener('slotchange', this.updateSlots);
  }

  updateSlots() {
    this.hasPrefix = hasSlot(this.host, 'prefix');
    console.log('hasPrefix', this.hasPrefix);
  }

  /** Sets focus on the switch. */
  @Method()
  async setFocus() {
    this.input.focus();
  }

  /** Removes focus from the switch. */
  @Method()
  async removeFocus() {
    this.input.blur();
  }

  handleClick() {
    this.checked = this.input.checked;
  }

  handleBlur() {
    this.hasFocus = false;
    this.slBlur.emit();
  }

  handleFocus() {
    this.hasFocus = true;
    this.slFocus.emit();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.checked = false;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.checked = true;
    }
  }

  handleMouseDown(event: MouseEvent) {
    // Prevent clicks on the label from briefly blurring the input
    event.preventDefault();
    this.input.focus();
  }

  handleLabelClick(event: MouseEvent) {
    // The toggle behavior is different when a prefix exists. Normally, clicking the label toggles the control, but if a
    // prefix exists, clicking the label should always check the control.
    if (this.hasPrefix) {
      event.preventDefault();
      this.checked = true;
    }
  }

  handlePrefixClick(event: MouseEvent) {
    // Clicking the prefix should always uncheck the control
    event.preventDefault();
    this.checked = false;
  }

  render() {
    return (
      <label
        part="base"
        htmlFor={this.switchId}
        role="switch"
        class={{
          switch: true,
          'switch--checked': this.checked,
          'switch--disabled': this.disabled,
          'switch--focused': this.hasFocus,
          'switch--has-prefix': this.hasPrefix
        }}
        onMouseDown={this.handleMouseDown}
      >
        <span part="prefix" class="switch__prefix" onClick={this.handlePrefixClick}>
          <slot name="prefix" />
        </span>

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb" />
          <input
            ref={el => (this.input = el)}
            id={this.switchId}
            type="checkbox"
            name={this.name}
            value={this.value}
            checked={this.checked}
            disabled={this.disabled}
            aria-labelledby={this.labelId}
            onClick={this.handleClick}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
          />
        </span>

        <span part="label" id={this.labelId} class="switch__label" onClick={this.handleLabelClick}>
          <slot />
        </span>
      </label>
    );
  }
}
