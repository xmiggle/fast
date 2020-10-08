import { ElementStyles, ElementViewTemplate, FASTElement } from "@microsoft/fast-element";

/**
 * Event detail object used while resolving the nearest FASTProvider
 * for an element.
 */
interface ResolveProviderEventDetail {
    fastProvider: FASTProvider | null;
}

export class FASTProvider extends FASTElement {
    /**
     * The nearest parent provider element, or null if no parent FASTProvider exists.
     */
    public get parentProvider(): FASTProvider | null {
        return this._parentProvider;
    }

    /**
     * Resolves the nearest FASTProvider ancestor for an element, or null if no FASTProvider ancestor exists.
     * @param el The element for which to resolve a FASTProvider
     */
    public static resolveProviderFor(el: EventTarget): FASTProvider | null {
        const event = new CustomEvent<ResolveProviderEventDetail>(
            FASTProvider.resolveProviderEventName,
            { detail: { fastProvider: null }, bubbles: true, composed: true }
        );

        el.dispatchEvent(event);
        return event.detail.fastProvider;
    }

    /**
     * Resolves a template for an element instance.
     * @param el The element instance to resolve a template for.
     */
    public resolveTemplateFor(el: FASTElement): ElementViewTemplate | null {
        return null;
    }

    /**
     * Resolves styles for an element instance.
     * @param el The element instance to resolve styles for.
     */
    public resolveStylesFor(el: FASTElement): ElementStyles | null {
        return null;
    }

    /**
     * Event name for resolving FASTProvider.
     */
    private static readonly resolveProviderEventName = "resolve-fast-provider";

    /**
     * Private storage for parent FASTProvider.
     */
    private _parentProvider: FASTProvider | null = null;

    /**
     * Event handler for resolving a FASTProvider.
     * @param e The resolve provider event object
     */
    private resolveProviderHandler(e: CustomEvent<ResolveProviderEventDetail>): void {
        e.stopImmediatePropagation();
        e.detail.fastProvider = this;
    }

    /**
     * Invoked when element is connected to the DOM.
     */
    public connectedCallback() {
        this._parentProvider = FASTProvider.resolveProviderFor(this);
        this.addEventListener(
            FASTProvider.resolveProviderEventName,
            this.resolveProviderHandler
        );

        super.connectedCallback();
    }

    public disconnectedCallback() {
        this._parentProvider = null;
        this.removeEventListener(
            FASTProvider.resolveProviderEventName,
            this.resolveProviderHandler
        );
    }
}
