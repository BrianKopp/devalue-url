import * as regexps from './reg-expressions';

export interface UrlDevaluerOptions {
    intReplacementName?: string;
    floatReplacementName?: string;
    guidReplacementName?: string;
    extraTemplatePatterns?: {[key: string]: string | RegExp };
}

/**
 * Class which strips values out of URLs.
 * Usage:
 * const urlDevaluer = new UrlDevaluer();
 * urlDevaluer.devalueUrl('https://example.com/hello/123');
 * // https://github.com/hello/:intId
 */
export class UrlDevaluer {
    private intReplacementName: string;
    private floatReplacementName: string;
    private guidReplacementName: string;
    private extraTemplatePatterns: {
        [key: string]: RegExp
    };

    /**
     * Creates a new UrlDevaluer with options
     * @param {Object} options - Options for the UrlDevaluer
     * @param {string} options.intReplacementName - The value to replace integer values, default=intId
     * @param {string} options.floatReplacementName - The value to replace float values, default=value
     * @param {string} options.guidReplacementName - The value to replace guid values, default guidId
     * @param {Object} options.extraTemplatePatterns - Dictionary of extra template patterns to run
     * on the URL. Formatted like { key: StringOrRegExp }
     */
    constructor({
        intReplacementName = 'intId',
        floatReplacementName = 'value',
        guidReplacementName = 'guidId',
        extraTemplatePatterns = {}
    }: UrlDevaluerOptions) {
        this.intReplacementName = intReplacementName || 'intId';
        this.floatReplacementName = floatReplacementName || 'value';
        this.guidReplacementName = guidReplacementName || 'guidId';
        this.extraTemplatePatterns = {};
        if (extraTemplatePatterns) {
            for (const name of Object.keys(extraTemplatePatterns)) {
                const value = extraTemplatePatterns[name];
                if (typeof value === 'string') {
                    this.extraTemplatePatterns[name] = RegExp(value);
                } else if (value instanceof RegExp) {
                    this.extraTemplatePatterns[name] = value;
                } else {
                    throw new Error(`Unexpected type ${typeof value} in options.extraTemplatePatterns. Expected string | RegExp`);
                }
            }
        }
    }

    /**
     * Strips values out of a URL
     * @param {string} url url, with or without host.
     * @returns {string} the URL with values stripped out of it
     */
    public devalueUrl(url: string): string {
        const urlParts = url.split('?');
        if (urlParts.length === 0) {
            return url;
        }
        const routePart = urlParts[0];
        const routeParts = routePart.split('/');
        const templatedParts: string[] = [];

        for (const part of routeParts) {
            let newPart = part;
            if (this.isInteger(part)) {
                newPart = `:${this.intReplacementName}`;
            } else if (this.isGuid(part)) {
                newPart = `:${this.guidReplacementName}`;
            } else if (this.isFloat(part)) {
                newPart = `:${this.floatReplacementName}`;
            } else {
                for (const name in Object.keys(this.extraTemplatePatterns)) {
                    if (this.extraTemplatePatterns[name].test(part)) {
                        newPart = `:${name}`;
                        break;
                    }
                }
            }
            templatedParts.push(newPart);
        }

        return templatedParts.join('/');
    }
    private isInteger(part: string): boolean {
        return regexps.intRegex.test(part);
    }
    private isFloat(part: string): boolean {
        return regexps.floatRegex.test(part);
    }
    private isGuid(part: string): boolean {
        for (const r of regexps.guidRegexes) {
            if (r.test(part)) {
                return true;
            }
        }

        return false;
    }
}
