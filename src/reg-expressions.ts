export const intRegex = RegExp(/^[+-]?\d+$/); // integer, with optional plus or minus
export const guidRegexes = [
    RegExp(/^[\da-f]{8}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{4}\-[\da-f]{12}$/), // lowercase uuid
    RegExp(/^[\dA-F]{8}\-[\dA-F]{4}\-[\dA-F]{4}\-[\dA-F]{4}\-[\dA-F]{12}$/), // uppercase uuid
    RegExp(/^[\da-f]{32}$/), // lowercase unhyphenated guid
    RegExp(/^[\dA-F]{32}$/), // uppercase unhyphenated guid
];
export const floatRegex = RegExp(/^[+-]?\d+\.\d+$/); // floating point number with optional plus minus
