

import FlowCtrl from '../index'



let demo = new FlowCtrl({mode: 'delay', delay: 1000});

demo.trigger(function(resolve, payload) {
    console.log('start: ', 1, payload);
    setTimeout(() => {
        console.log('end: ', 1);
        resolve(true, '测试')
    }, 2000)
}, {mode: 'async', priority: 10})

demo.trigger(function() {
    console.log('start: ', 2);
    console.log('end: ', 2);
}, {mode: 'sync', priority: 100})

demo.trigger(function(resolve, payload) {
    console.log('start: ', 3, payload);
    setTimeout(() => {
        console.log('end: ', 3);
        resolve(true, '测试')
    }, 2000)
}, {mode: 'async', priority: 1000})

demo.trigger(function() {
    console.log('start: ', 4);
    setTimeout(() => {
        console.log('end: ', 4);
    }, 2000)
}, {mode: 'delay', priority: 1000})