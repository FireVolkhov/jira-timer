import React from "react";
import ReactDOM from "react-dom";

export default class ListItem extends React.Component {
    static propTypes: {
        className: React.PropTypes.string,
        openPanel: React.PropTypes.bool.isRequired,
        onClick: React.PropTypes.func,
        children: React.PropTypes.array
    };

    render() {
        let cssClass = 'list-item ' +
            (this.props.openPanel ? ' list-item_open ' : '') +
            (this.props.className || '');

        return <div className={cssClass} onClick={this.props.onClick}>
            {this.props.children}
        </div>;
    }
}
