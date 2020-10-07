import { ElementStyles, ElementViewTemplate, FASTElement } from "@microsoft/fast-element";

/**
 * Provider
 */
export interface FASTProvider {
    resolveTemplateFor(el: FASTElement): ElementViewTemplate | null;
    resolveStylesFor(el: FASTElement): ElementStyles | null;
}

export class FASTProvider {
    static resolveProvider(el: FASTElement): FASTProvider | null {
        return null;
    }
}
