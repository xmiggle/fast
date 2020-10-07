import { ElementStyles, ElementViewTemplate, FASTElement } from "@microsoft/fast-element";

/**
 * Provider
 */
export interface FASTProvider {
    resolveTemplateFor(el: FASTElement): ElementViewTemplate | null;
    resolveStylesFor(el: FASTElement): ElementStyles | null;
}

/**
 * The event name for resolving a FASTProvider
 */
export class FASTProvider extends FASTElement {
    private static readonly resolveProviderEventName = "resolve-fast-provider";

    /**
     * Resolves the nearest FASTProvider ancestor for an element, or null if no FASTProvider ancestor exists.
     * @param el The element for which to resolve a FASTProvider
     */
    public static resolveProvider(el: FASTElement & HTMLElement): FASTProvider | null {
        const event = new CustomEvent<{ fastProvider: FASTProvider | null }>(
            FASTProvider.resolveProviderEventName,
            { detail: { fastProvider: null } }
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
     * The nearest parent provider element, or null if no parent FASTProvider exists.
     */
    public get parentProvider(): FASTProvider | null {
        return this._parentProvider;
    }

    /**
     * Private storage for parent FASTProvider.
     */
    private _parentProvider: FASTProvider | null = null;

    /**
     * Invoked when element is connected to the DOM.
     */
    public connectedCallback() {
        this._parentProvider = FASTProvider.resolveProvider(this);
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

    /**
     * Event handler for resolving a FASTProvider.
     * @param e The resolve provider event object
     */
    private resolveProviderHandler(e: CustomEvent<{ fastProvider: FASTProvider }>): void {
        e.stopImmediatePropagation();
        e.detail.fastProvider = this;
    }
}
