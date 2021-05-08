/*
 * @Author: wanxiaodong
 * @Date: 2021-05-08 10:22:27
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2021-05-08 18:00:52
 * @Description: 
 */

import {FlowParams} from './interfaces/flow';
import {stepOptionInterface} from './interfaces/step'

import Step from './step'

const {Mode} = require('./types/mode.ts');


export default class FlowCtrl {

    static Step:any = Step

    protected stack: Array<Step> = []

    protected mode: string = Mode.Hybrid

    protected auto: boolean = true

    protected active: Step

    protected destroyed: boolean = false

    protected dispatched: boolean = false // 是否已经触发过

    constructor(options: FlowParams = {}) {
        if (!(this instanceof FlowCtrl)) {
            return new FlowCtrl(options);
        }
        let {mode, auto} = options;
        mode && (this.mode = mode);
        (auto === false) && (this.auto = auto);
    }
    /**
     * 追加逻辑
     * @param callback 
     * @param options 
     * @returns 
     */
    public trigger (callback: any, options: stepOptionInterface = {}) {
        if (this.destroyed) throw Error('flow 已销毁');
        let instance: Step;
        if (callback instanceof Step) {
            instance = callback;
            instance.context = this;
        } else {
            instance = new Step(callback, options, this);
        }
        this.stack.push(instance);
        if (this.auto || this.dispatched) {
            setTimeout(() => {
                // 这样可以再执行追加多个逻辑的时候 收集完所有逻辑后进行触发
                this.dispatch(null);
            }, 0)
            return instance;
        }
    }
    /**
     * 触发
     * @param _payload 
     */
    public dispatch(_payload: any = null) {
        if (this.destroyed) throw Error('flow 已销毁');
        (!this.dispatched) && (this.dispatched = true); // 添加触发记录
        switch (this.mode) {
            case Mode.Async: {
                this.asyncHandle(_payload);
                break;
            }
            case Mode.Sync: {
                this.syncHandle(_payload);
                break;
            }
            case Mode.Delay: {
                this.delayHandle(_payload);
                break;
            }
            case Mode.Hybrid: {
                this.hybridHandle(_payload);
                break;
            }
            default: {
                this.syncHandle(_payload);
                break;
            }
        }
    }
    /**
     * 异步模式
     * @param _payload 
     * @returns 
     */
    protected asyncHandle(_payload: any) {
        if (this.active) {
            // noop
        } else {
            if (this.stack.length > 0) {
                let step = this.active = this.sortStack()[0];
                step.dispatch(_payload).then((state) => {
                    step.destory();
                    step = null;
                    if (state) {
                        this.dispatch(step.payload);
                    } else {
                        this.stack.forEach((step:Step) => {
                            step.destory();
                        })
                    }
                });
            } else {
                return Promise.resolve();                
            }
        }

    }
    /**
     * 同步模式
     * @param _payload 
     */
    protected syncHandle(_payload: any) {
        this.sortStack().forEach((item:Step) => {
            item.dispatch(_payload);
            item.destory();
        })
    }
    /**
     * 延迟模式
     * @param _payload 
     */
    protected delayHandle(_payload: any) {
        if (this.active) {
            // noop
        } else {
            let step = this.active = this.sortStack()[0];
            if (step) {
                (step.dispatch(_payload) || Promise.resolve(true)).then((state) => {
                    step.destory();
                    this.active = null;
                    if (state) {
                        this.dispatch(step.payload);
                    }
                });
            }
        }
    }
    /**
     * 混合模式
     * @param _payload 
     */
    protected hybridHandle(_payload: any) {
        let list = this.sortStack();
        let _state = false;
        if (list.length > 0) {
            list.forEach((step:Step) => {
                if (_state) return false;
                switch (step.mode) {
                    case Mode.Sync: {
                        if (this.active) {
                            _state = true;
                        } else {
                            step.dispatch(_payload);
                            step.destory();
                        }
                        break;
                    }
                    case Mode.Async: {
                        if (this.active) {
                            _state = true;
                        } else {
                            this.active = step;
                            step.dispatch(_payload).then((state) => {
                                step.destory();
                                this.active = null;
                                if (state) {
                                    this.dispatch(step.payload);
                                }
                            });
                        }
                        break;
                    }
                    case Mode.Delay: {
                        if (this.active) {
                            _state = true;
                        } else {
                            this.active = step;
                            step.dispatch(_payload).then((state) => {
                                step.destory();
                                this.active = null;
                                if (state) {
                                    this.dispatch(step.payload);
                                }
                            }) 
                        }
                        break;
                    }
                    default: {
                        if (this.active) {
                            _state = true;
                        } else {
                            step.dispatch(_payload);
                            step.destory();
                        }
                        break;
                    }
                }

            })
        }
    }

    public destory() {
        this.stack.length = 0;
        this.active = null;
        this.destroyed = true;
    }
    /**
     * 删除step
     * @param step 
     */
    public remove(step: Step) {
        let index = this.stack.indexOf(step);
        if (index >= 0) {
            this.stack.splice(index, 1);
        }
    }
    /**
     * 进行优先级排序
     * @returns 
     */
    private sortStack() {
        return this.stack.sort((step1: Step, step2: Step) => {
            return step2.priority - step1.priority
        }).slice();
    }
}
