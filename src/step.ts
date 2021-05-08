/*
 * @Author: wanxiaodong
 * @Date: 2021-05-08 10:46:20
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2021-05-08 18:04:45
 * @Description: 
 */

import {Status} from './types/status';
import {stepOptionInterface} from './interfaces/step'
import {Mode} from './types/mode'
import FlowCtrl from './main' 
export default class Step {
    
    callback: Function // 回调函数

    priority: number// 优先级

    mode: string // 模式

    delay: number // 延迟

    status: string = Status.Normal // 状态

    timer: Promise<any>

    context: FlowCtrl

    payload: any = null // 附带数据

    constructor(callback: Function, options: stepOptionInterface = {}, context?: FlowCtrl) {
        this.callback = callback;

        let {priority = 0, mode = Mode.Sync, delay = 0} = options;

        this.priority = priority;
        this.mode = mode;
        this.delay = delay;

        context && (this.context = context);
    }


    dispatch(_payload: any = null) {
        const that = this;
        if (this.mode === Mode.Async) {
            return this.timer = new Promise((resolve) => {
                this.callback(function(state: boolean = true, payload: any) {
                    resolve(state);
                    that.payload = payload;
                }, _payload);
            }).catch((e) => {
                console.warn(e.message);
            })
        } else if (this.mode === Mode.Delay) {
            return this.timer = new Promise((resolve) => {
                this.callback()
                setTimeout(() => {
                    resolve(true);
                }, this.delay)
            }).catch((e) => {
                console.warn(e.message);
                return false;
            })
        } else {
            this.callback();
        }
    }

    destory() {
        if (this.context) {
            this.context.remove(this);
        }
        this.payload = null;
        this.timer = null;
        this.callback = null;
        this.timer = null;
    }

}