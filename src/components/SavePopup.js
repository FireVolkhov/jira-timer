import React from "react";
import JiraSaver from "../services/jira-saver";
import CoreComponent from "../core/CoreComponent";

export default class SavePopup extends CoreComponent {
    getInitState(){
        return {
            blocks: [],
            opened: false,
            loading: false
        };
    }

    componentDidMount() {
        this.__onClick = (e) => {
            let target = $(e.target);
            let $this = $(this.refs.this);

            if (!target.is($this) && target.closest($this).length === 0) {
                this.close();
            }
        };
    }

    render() {
        return this.if(this.state.opened, <div className="b-popup__container">
            <div ref="this" className="b-popup" style={{opacity: this.state.loading ? 0.5 : 1}}>
                {_.map(this.state.blocks, (b) => {
                    let valid = b.time > 0 && b.task && b.date && b.text;
                    const hours = parseInt(b.time/60);

                    return <div key={b.id} className={`b-block b-block_valid_${valid ? 'yes' : 'no'}`}>
                        <div><b>Task:</b> <a href={`/browse/${b.task}`}>{b.task}</a></div>
                        <div><b>Time:</b> {0 < hours ? hours + 'h' : ''} {b.time % 60}m</div>
                        <div><b>Date:</b> {b.date}</div>
                        <div dangerouslySetInnerHTML={{__html: b.text.replace(/\n/g, '<br/>')}}/>
                    </div>;
                })}
                <button
                    className="popup-save-button"
                    onClick={() => this.submit()}
                    >SAVE</button>
            </div>
        </div>);
    }

    /**
     * @public
     * @param {Array} blocks Список блоков времени
     * @returns {Promise.<Array>}
     */
    open(blocks) {
        if (this.state.opened) {
            return this._openPromise;
        } else {
            $(document).on('click', this.__onClick);

            this._openPromise = new Promise((resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
            });

            return this.setState({
                blocks: blocks,
                loading: false,
                opened: true
            })
                .then(() => this._openPromise);
        }
    }

    _close(callback = Function.prototype) {
        if (this.state.opened) {
            $(document).off('click', this.__onClick);
            return this
                .setState({opened: false})
                .then(() => {
                    callback();

                    delete this._openPromise;
                    delete this._resolve;
                    delete this._reject;
                });
        }
    }

    close() {
        return this._close(() => this._reject('Close'));
    }

    submit() {
        return this.setState({loading: true})
            .then(() => JiraSaver.multiSave(this.state.blocks))
            .then(() => this._close(() => this._resolve()));
    }
}