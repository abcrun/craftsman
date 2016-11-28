import React, { Component } from 'react';
import s from './server_render.css';

export default class Layout extends Component {
    render() {
        let { node } = this.props,
            data = node.data, styles = data.styles, components = data.components,
            children = node.children();

        return (
            <div className={ s.layout } style={ styles }>
                {
                    children.map(child => {
                        let index = child.index;
                        return <Layout key={ index } node={ child } />
                    })
                }
            </div>
        )
    }
}
