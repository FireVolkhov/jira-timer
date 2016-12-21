import React from "react";
import ReactDOM from "react-dom";
import Promise from "../core/Promise";

import ListItem from "./ListItem";
import SavePopup from "./SavePopup";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = App.getInitialState();
    }

    static getInitialState(){
        return {
            open: false,
            yes: false,
            value: localStorage.getItem('jira-timer-log')
        };
    }

    componentDidMount() {
        this._localStoreSet = _.debounce((value) => {
            value  = this.preParse(value);
            this.setState({value});
            localStorage.setItem('jira-timer-log', value);
        }, 300);
    }

    setValue(value) {
        this._localStoreSet(value);
        this.setState({
            value: value,
            yes: false
        });
    }

    preParse(value) {
        let lines = value.split('\n');

        _.each(lines, (l, i) => {
            let taskNameReg = /^task page$/i;
            let taskReg = /^\/browse\/([^?]+)(?:\?.*)?/i;
            let now = /^now$/i;



            if (taskNameReg.test(l) && taskReg.test(location.pathname)) {
                lines[i] = `task ${location.pathname.match(taskReg)[1]}`;
            }

            if (now.test(l)) {
                let date = new Date();
                let hours = date.getHours();
                let minets = date.getMinutes();

                lines[i] = `${hours} ${minets > 9 ? minets : ('0' + minets)}`;
            }
        });

        return lines.join('\n');
    }

    parseLog(value) {
        let lines = value.split('\n');
        lines = _.map(lines, (l) => l.trim());
        _.remove(lines, (l) => !l);

        let blocks = [];
        let currentBlock = {};
        let init = false;

        _.each(lines, (l) => {
            let timeLine = /^((\d?\d)(?:\/|\s)(\d?\d)\s)?(\d?\d)(?:\s|:)(\d?\d)$/i;

            if (timeLine.test(l)) {
                if (init) {
                    currentBlock.stop = l;
                    blocks.push(currentBlock);
                }
                init = true;
                currentBlock = {
                    id: _.uniqueId(),
                    lines: [],
                    start: l,
                    stop: '',
                    time: '',
                    task: '',
                    text: ''
                };

            } else {
                currentBlock.lines.push(l);
            }
        });

        _.each(blocks, (b) => {
            _.each(b.lines, (l) => {
               let taskLine = /^Task(?:\s)+(.+)$/i;

               if (!b.task && taskLine.test(l)) {
                   b.task = l.match(taskLine)[1];
               } else {
                   b.text += l + '\n';
               }
            });

            let start = b.start.split(/(\s|:|\/)/);
            let stop = b.stop.split(/(\s|:|\/)/);

            start = _.filter(start, (x) => x !== ' ' && x !== '/' && x !== ':');
            stop = _.filter(stop, (x) => x !== ' ' && x !== '/' && x !== ':');

            if (start.length === 4) {
                let date = new Date();

                date.setMilliseconds(0);
                date.setSeconds(0);
                date.setMinutes(0);
                date.setHours(0);
                date.setDate(0);
                date.setMonth(0);

                date.setDate(start[0]);
                date.setMonth(start[1] - 1);

                b.date = date;

                start.splice(0, 2);
            }

            if (stop.length === 4) {
                stop.splice(0, 2);
            }

            b.start = parseInt(start[0]) * 60 + parseInt(start[start.length - 1]);
            b.stop = parseInt(stop[0]) * 60 + parseInt(stop[stop.length - 1]);

            b.time = b.stop - b.start;
        });

        _.each(blocks, (b) => {
            if (b.text.trim() && b.task) {
                let clones = _.filter(blocks, (x) => x.id !== b.id && x.task === b.task);
                let cleanClones = _.filter(clones, (x) => !x.text.trim());
                let cleanIds = _.map(cleanClones, 'id');

                _.each(blocks, (x) => {
                    if (~cleanIds.indexOf(x.id)) {
                        x.needDelete = true;
                        b.time += x.time;
                        return true;
                    }
                });
            }
        });

        _.remove(blocks, (b) => b.needDelete);

        blocks = _.map(blocks, (b) => {
            let date = b.date || new Date();

            date.setMilliseconds(0);
            date.setSeconds(0);
            date.setMinutes(0);
            date.setHours(0);

            date.setMinutes(b.stop);

            date = moment(date);
            date = date.format('DD/MMM/YY hh:mm A');
            b.date = date;

            return b;
        });

        return this.refs.popup
            .open(blocks)
            .then(() => this.setValue(''))
            .then(() => this.setState({yes: true}))
            .catch((e) => console.error(e));
    }

    render() {
        let cssClass = 'app app_jira-timer app_open_' +
            (this.state.open ? 'yes' : 'no');

        let manual = '09 50\n' +
            'task Unit6-2\n' +
            'Так выглядит обычный лог\n\n' +
            '10 50\n' +
            'Если нужно, можно сделать пустой блок без таски и он не залогируется\n\n' +
            '11 00\n' +
            'task page\n' +
            'При написании названия таски "page" номер будет взят со странице\n\n' +
            'now\n' +
            '"now" заменяется на текущее время\n\n' +
            '21/12 12 10\n' +
            'Так можно указать конкретную дату для времени\n' +
            'После нажатия "save" покажеться попап с данными которые будут залогированы\n\n' +
            '21/12 13 40';

        return <div className={cssClass}>
            <textarea
                className="text"
                value={this.state.value}
                onChange={(e) => this.setValue(e.target.value)}
                placeholder={manual}
                ></textarea>
            <button
                className="save-button"
                onClick={() => this.parseLog(this.state.value)}
                style={{color: this.state.yes ? 'green' : null}}
                >SAVE</button>
            <SavePopup ref="popup"/>
            <ListItem
                className='hide-button'
                openPanel={this.state.open}
                onClick={() => this.setState({open: !this.state.open, value: localStorage.getItem('jira-timer-log')})}>
                <div className='list-item__text'>{this.state.open ? 'Скрыть' : 'Показать'}</div>
            </ListItem>
        </div>;
    }
}
