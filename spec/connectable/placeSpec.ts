/// <reference path="../../typings/tsd.d.ts" />

import Place = require('../../src/connectable/Place');

describe("Place", () => {
	beforeEach(() => {
		this.place = new Place('test place');
	});

	it('sets `tokens` to 0', () => {
		expect(this.place.tokens).toEqual(0);
	});

	describe('produce()', () => {
		it('increments `tokens` by 1', () => {
			this.place.produce();
			expect(this.place.tokens).toEqual(1);
		});
	});

	describe('consume()', () => {
		it('decrements `tokens` by 1', () => {
			this.place.tokens = 1;
			this.place.consume();
			expect(this.place.tokens).toEqual(0);
		});
	});
});