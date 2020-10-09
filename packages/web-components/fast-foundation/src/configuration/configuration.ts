import {
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";

export interface ConfigurationOptions {
    /**
     * Element tagname prefix
     */
    prefix?: string;
}

export interface ComponentConfiguration extends ConfigurationOptions {
    /**
     * The non-prefixed name of the component.
     */
    baseName: string;

    /**
     * The element constructor
     */
    type: typeof FASTElement;

    /**
     * The default template to use for the component.
     */
    template?: ElementViewTemplate;

    /**
     * The default styles to use for the component.
     */
    styles?: ElementStyles;
}

interface Registry {
    register(config: Configuration): void;
}

export class Configuration {
    constructor(options: ConfigurationOptions = {}) {
        this.prefix = options.prefix || "fast";
    }

    public static forComponent(defaultElementConfiguration: ComponentConfiguration) {
        return (
            elementConfiguration: Partial<Omit<ComponentConfiguration, "type">>
        ): Registry => {
            return {
                register(configuration) {
                    const conf = {
                        ...defaultElementConfiguration,
                        ...elementConfiguration,
                    };
                    const definition = { name: `${conf.prefix}-${conf.baseName}` };

                    configuration
                        .registerElement(defaultElementConfiguration.type, definition)
                        .setDefaultTemplateFor(definition.name, conf.template || null)
                        .setDefaultStylesFor(definition.name, conf.styles || null);
                },
            };
        };
    }

    /**
     * The tag name prefix with which Custom Elements are defined.
     */
    public readonly prefix: string;

    /**
     * Registers and defines a custom element
     * @param type The custom element constructor
     * @param definition custom element definition metadata
     */
    public registerElement(
        type: typeof FASTElement,
        definition: PartialFASTElementDefinition
    ): this {
        this.elementRegistry.set(type, definition);
        FASTElement.define(type, definition);

        return this;
    }

    /**
     * Sets the default template for an element.
     * @param name The non-prefixed element tag-name.
     * @param template The template to set as the default template.
     */
    public setDefaultTemplateFor(name: string, template: ElementViewTemplate | null) {
        this.templateRegistry.set(name, template);
        return this;
    }

    /**
     * Gets the template for an element, or null.
     * @param name The non-prefixed element tag-name.
     */
    public getDefaultTemplateFor(name: string): ElementViewTemplate | null {
        return this.templateRegistry.get(name) || null;
    }

    /**
     *
     * @param name The non-prefixed element tag-name.
     * @param styles The styles to set as the default styles.
     */
    public setDefaultStylesFor(name: string, styles: ElementStyles | null) {
        this.stylesRegistry.set(name, styles);
        return this;
    }

    /**
     * Gets the styles for an element, or null.
     * @param name The non-prefixed element tag-name.
     */
    public getDefaultStylesFor(name: string): ElementStyles | null {
        return this.stylesRegistry.get(name) || null;
    }

    private templateRegistry = new Map<string, ElementViewTemplate | null>();
    private stylesRegistry = new Map<string, ElementStyles | null>();
    private elementRegistry = new Map<typeof FASTElement, PartialFASTElementDefinition>();
}
