import * as regexps from './reg-expressions';

export class UrlDevaluer {
    private intReplacementName: string;
    private floatReplacementName: string;
    private guidReplacementName: string;
    private extraTemplatePatterns: {
        [key: string]: RegExp
    };
    constructor(
        options: {
            intReplacementName?: string,
            floatReplacementName?: string,
            guidReplacementName?: string,
            extraTemplatePatterns?: {
                [key: string]: string | RegExp
            }
        } = {}
    ) {
        this.intReplacementName = options.intReplacementName || 'intId';
        this.floatReplacementName = options.floatReplacementName || 'value';
        this.guidReplacementName = options.guidReplacementName || 'guidId';
        this.extraTemplatePatterns = {};
        if (options.extraTemplatePatterns) {
            for (const name of Object.keys(options.extraTemplatePatterns)) {
                const value = options.extraTemplatePatterns[name];
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
