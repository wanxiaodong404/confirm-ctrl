import { FlowParams } from './interfaces/flow';
import { stepOptionInterface } from './interfaces/step';
import Step from './step';
export default class FlowCtrl {
    static Step: any;
    protected stack: Array<Step>;
    protected mode: string;
    protected active: Step;
    protected destroyed: boolean;
    constructor(options?: FlowParams);
    trigger(callback: any, options?: stepOptionInterface): Step;
    dispatch(_payload?: any): void;
    protected asyncHandle(_payload: any): Promise<void>;
    protected syncHandle(_payload: any): void;
    protected delayHandle(_payload: any): void;
    protected hybridHandle(_payload: any): void;
    destory(): void;
    remove(step: Step): void;
    private sortStack;
}
