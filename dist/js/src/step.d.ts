import { stepOptionInterface } from './interfaces/step';
import FlowCtrl from './main';
export default class Step {
    callback: Function;
    priority: number;
    mode: string;
    delay: number;
    status: string;
    timer: Promise<any>;
    context: FlowCtrl;
    payload: any;
    constructor(callback: Function, options?: stepOptionInterface, context?: FlowCtrl);
    dispatch(_payload?: any): Promise<unknown>;
    destory(): void;
}
