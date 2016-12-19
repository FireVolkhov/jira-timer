import React from 'react';
import Promise from './Promise.js';

export default class CoreComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitState(props);
    }

    getInitState(props) {
        return {};
    }

    setState(state) {
        return new Promise((resolve) => super.setState(state, resolve));
    }

    if(condition, html) {
        return condition ? html : null;
    }

    remove(array, item){
        let i;

        if (~(i = array.indexOf(item))) {
            array.splice(i, 1);
        }
        return array;
    }

    argString(value, name) {
        if (typeof value !== 'string') {
            throw new Error(`Arg ${name} must be String`);
        }
    }

    timeout(callback, time = 0) {
        setTimeout(() => callback(), time);
    }
}
