const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const UrlDevaluer = require('../src/url-devaluer').UrlDevaluer;


describe('UrlDevaluer class unit tests', () => {
    it('should accept an empty constructor and default arguments', () => {
        const urlDevaluer = new UrlDevaluer();
        expect(urlDevaluer.intReplacementName).to.eql('intId');
        expect(urlDevaluer.floatReplacementName).to.eql('value');
        expect(urlDevaluer.guidReplacementName).to.eql('guidId');
        expect(Object.keys(urlDevaluer.extraTemplatePatterns).length).to.eql(0);
    });
    it('should accept overwrites to replacement names', () => {
        const urlDevaluer = new UrlDevaluer({
            intReplacementName: 'intReplace',
            guidReplacementName: 'guidReplace',
            floatReplacementName: 'floatReplace'
        });
        expect(urlDevaluer.intReplacementName).to.eql('intReplace');
        expect(urlDevaluer.floatReplacementName).to.eql('floatReplace');
        expect(urlDevaluer.guidReplacementName).to.eql('guidReplace');
    });
    it('should accept extra template patterns in either string or RegExp', () => {
        const urlDevaluer = new UrlDevaluer({
            extraTemplatePatterns: {
                'string': 'abc',
                'regexp': RegExp('abc')
            }
        });
        const keys = Object.keys(urlDevaluer.extraTemplatePatterns);
        expect(keys).to.eql(['string', 'regexp']);
        expect(urlDevaluer.extraTemplatePatterns).to.eql({
            'string': RegExp('abc'),
            'regexp': RegExp('abc')
        });
    });
    it('should error when extra template patterns not regex or string', () => {
        try {
            const urlDevaluer = new UrlDevaluer({
                extraTemplatePatterns: {
                    'notAString': 5
                }
            });
            expect.fail();
        } catch (err) {
            expect(err.message).to.eql('Unexpected type number in options.extraTemplatePatterns. Expected string | RegExp');
        }
    });
    it('should strip integer out of url', () => {
        const url = 'https://example.com/123';
        const urlDevaluer = new UrlDevaluer();
        const result = urlDevaluer.devalueUrl(url);
        expect(result).to.eql('https://example.com/:intId');
    });
    it('should strip hyphenated, lowercase guid out of url', () => {
        const url = 'https://example.com/8304e058-b5dd-477c-9891-bb8b36faa28e';
        const urlDevaluer = new UrlDevaluer();
        const result = urlDevaluer.devalueUrl(url);
        expect(result).to.eql('https://example.com/:guidId');
    });
    it('should strip hyphenated, uppercase guid out of url', () => {
        const url = 'https://example.com/947059EF-08BB-4570-8C3A-CC41B384BF10';
        const urlDevaluer = new UrlDevaluer();
        const result = urlDevaluer.devalueUrl(url);
        expect(result).to.eql('https://example.com/:guidId');
    });
    it('should strip unhyphenated, lowercase guid out of url', () => {
        const url = 'https://example.com/b3a4eb83bb8a427f891f8aff1863c66e';
        const urlDevaluer = new UrlDevaluer();
        const result = urlDevaluer.devalueUrl(url);
        expect(result).to.eql('https://example.com/:guidId');
    });
    it('should strip unhyphenated, uppercase guid out of url', () => {
        const url = 'https://example.com/E7FC5E4326BB4434970C77A66A5FCA88';
        const urlDevaluer = new UrlDevaluer();
        const result = urlDevaluer.devalueUrl(url);
        expect(result).to.eql('https://example.com/:guidId');
    });
    it('should not strip value when too short to be a guid', () => {
        const url = 'https://example.com/FC5E4326BB4434970C77A66A5FCA88';
        const urlDevaluer = new UrlDevaluer();
        const result = urlDevaluer.devalueUrl(url);
        expect(result).to.eql('https://example.com/FC5E4326BB4434970C77A66A5FCA88');
    });
    it('should not strip value when too long to be a guid', () => {
        const url = 'https://example.com/E7FC5E4326BB4434970C77A66A5FCA88A8';
        const urlDevaluer = new UrlDevaluer();
        const result = urlDevaluer.devalueUrl(url);
        expect(result).to.eql('https://example.com/E7FC5E4326BB4434970C77A66A5FCA88A8');
    });
    it('should strip floating point value out of url', () => {
        const url = 'https://example.com/1.2';
        const urlDevaluer = new UrlDevaluer();
        const result = urlDevaluer.devalueUrl(url);
        expect(result).to.eql('https://example.com/:value');
    });
});