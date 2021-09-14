// Same as Element.closest(), but breaks through shadow roots to find the closest matching selector
export function closest(selector: string, root: Element = this) {
  function getNext(el: Element | HTMLElement, next = el && el.closest(selector)): Element | null {
    if (el instanceof Window || el instanceof Document || !el) {
      return null;
    }

    return next ? next : getNext((el.getRootNode() as ShadowRoot).host);
  }

  return getNext(root);
}
