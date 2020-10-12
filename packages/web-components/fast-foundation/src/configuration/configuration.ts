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

export interface Configuration {
    /**
     * The tag name prefix with which Custom Elements are defined.
     */
    readonly prefix: string;

    /**
     * Registers and defines a custom element
     * @param type The custom element constructor
     * @param definition custom element definition metadata
     */
    registerElement(
        type: typeof FASTElement,
        definition: PartialFASTElementDefinition
    ): Configuration;

    /**
     * Sets the default template for an element.
     * @param name The non-prefixed element tag-name.
     * @param template The template to set as the default template.
     */
    setDefaultTemplateFor(
        name: string,
        template: ElementViewTemplate | null
    ): Configuration;

    /**
     * Gets the template for an element, or null.
     * @param name The non-prefixed element tag-name.
     */
    getDefaultTemplateFor(name: string): ElementViewTemplate | null;

    /**
     * Sets the default styles for an element.
     * @param name The non-prefixed element tag-name.
     * @param styles The styles to set as the default styles.
     */
    setDefaultStylesFor(name: string, styles: ElementStyles | null): Configuration;

    /**
     * Gets the styles for an element, or null.
     * @param name The non-prefixed element tag-name.
     */
    getDefaultStylesFor(name: string): ElementStyles | null;
}

export class FASTConfiguration implements Configuration {
    constructor(options: ConfigurationOptions = {}) {
        this.prefix = options.prefix || "fast";
    }

    /**
     * TODO: Can we make this static somehow?
     */
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

    /** {@inheritdoc Configuration.prefix} */
    public readonly prefix: string;

    /** {@inheritdoc Configuration.registerElement} */
    public registerElement(
        type: typeof FASTElement,
        definition: PartialFASTElementDefinition
    ): this {
        this.elementRegistry.set(type, definition);
        FASTElement.define(type, definition);

        return this;
    }

    /** {@inheritdoc Configuration.setDefaultTemplateFor} */
    public setDefaultTemplateFor(name: string, template: ElementViewTemplate | null) {
        this.templateRegistry.set(name, template);
        return this;
    }

    /** {@inheritdoc Configuration.getDefaultTemplateFor} */
    public getDefaultTemplateFor(name: string): ElementViewTemplate | null {
        return this.templateRegistry.get(name) || null;
    }

    /** {@inheritdoc Configuration.setDefaultStylesFor} */
    public setDefaultStylesFor(name: string, styles: ElementStyles | null) {
        this.stylesRegistry.set(name, styles);
        return this;
    }

    /** {@inheritdoc Configuration.getDefaultStylesFor}*/
    public getDefaultStylesFor(name: string): ElementStyles | null {
        return this.stylesRegistry.get(name) || null;
    }

    private templateRegistry = new Map<string, ElementViewTemplate | null>();
    private stylesRegistry = new Map<string, ElementStyles | null>();
    private elementRegistry = new Map<typeof FASTElement, PartialFASTElementDefinition>();
}
