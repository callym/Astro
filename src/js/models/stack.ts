import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Stack<T> {
	private stack: T[];
	private stack_subject: BehaviorSubject<T>;

	public get length(): number {
		return this.stack.length;
	}

	public constructor(initial: T) {
		this.stack = [initial];
		this.stack_subject = new BehaviorSubject(initial);
	}

	public subscribe(): Observable<T> {
		return this.stack_subject.asObservable();
	}

	public empty(initial: T) {
		this.stack = [initial];
		this.stack_subject.next(initial);
	}

	public push(item: T) {
		this.stack.push(item);
		this.stack_subject.next(item);
	}

	public pop(): T | undefined {
		return this.stack.pop();
	}

	public peek(): T {
		return this.stack[this.stack.length - 1];
	}
}
