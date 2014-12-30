/// <reference path="../typings/tsd.d.ts" />

import _ = require('lodash');

module petri {
	export class Arc {
		constructor(public input: Connectable, public output: Connectable) {
			input.outputArcs.push(this);
			output.inputArcs.push(this);
		}
	}

	export class Connectable {
		public inputArcs: Arc[] = [];
		public outputArcs: Arc[] = [];

		constructor(public name: string) {
		}

		inputs() {
			return _.pluck(this.inputArcs, 'input');
		}

		outputs() {
			return _.pluck(this.outputArcs, 'output');
		}
	}

	export class Place extends Connectable {
		public tokens: number = 0;

		constructor(public name: string) {
			super(name);
		}

		consume() {
			if (this.tokens < 1) {
				return;
			}

			this.tokens -= 1;
		}

		produce() {
			this.tokens += 1;
		}
	}

	export class Transition extends Connectable {
		constructor(public name: string, inputs: Place[], outputs: Place[]) {
			super(name);

			inputs.forEach((input) => {
				new Arc(input, this);
			});

			outputs.forEach((output) => {
				new Arc(this, output);
			});
		}

		enabled(): boolean {
			var places = <Place[]> this.inputs();
			
			var placeHasToken = function(p: Place): boolean {
				return p.tokens > 0;
			};

			return _.filter(places, placeHasToken).length === places.length;
		}

		fire() {
			if (!this.enabled()) {
				return;
			}

			_.each(this.inputs(), (p: Place) => p.consume());
			_.each(this.outputs(), (p: Place) => p.produce());
		}
	}

	export class Net {
		transitions: Transition[];
		places: Place[];

		constructor(private start: Place) {
			var visitResult = visit(this.start);

			this.transitions = visitResult.transitions;
			this.places = visitResult.places;
		}

		ingest(count: number = 1) {
			this.start.tokens += count;
		}

		execute() {
			_.each(this.transitions, (t: Transition) => t.fire());
		}

		summary() {
			_.each(this.places, (place) => {
				console.log(place.name + ": " + place.tokens);
			});
		}
	}

	export interface VisitResult {
		places: Place[];
		transitions: Transition[]
	}

	export function visit(start: Place, result: VisitResult = { places: [], transitions: [] }) : VisitResult {
		if (_.contains(result.places, start)) {
			return result;
		}

		result.places.push(start);

		var transitions = <Transition[]> start.outputs();

		if (transitions.length === 0) {
			return result;
		}

		result.transitions = result.transitions.concat(transitions);

		return visit(transitions[0].outputs()[0], result);
	}
}

export = petri;
