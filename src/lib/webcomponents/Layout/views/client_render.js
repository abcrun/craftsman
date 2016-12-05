import React, { Component } from 'react';
import s from './client_render.css';

export default class Layout extends Component {
    setCursor(e, index, actions){
        let inspect = document.querySelector('.inspect'), target = e.target;
        if(target.getAttribute('data-type') != 'layout') return;

        e.stopPropagation();
        if(!/cursor/.test(inspect.className)) return;

        actions.setCursor({ index });
    }

    inspect(e) {
        let inspect = document.querySelector('.inspect'),
            layout = document.querySelector('.layout'),
            settings = document.querySelector('.content_settings');
        e.stopPropagation();

        this.refs.hover.className = 'hover';
        inspect.className = 'inspect';

        layout.parentNode.parentNode.style.cssText = 'width:336px;';
        layout.className = 'layout current';
        settings.className = 'content_settings';
    }

    render() {
        let { cursor, node, actions } = this.props,
            data = node.data, styles = data.styles, components = data.components,
            children = node.children();

        return (
            <div data-type="layout" className={ s.layout } style={ styles }
                onMouseOver={ e => this.setCursor(e, node.index, actions) }
                onClick={ e => this.inspect(e)} >
                {
                    children.map(child => {
                        let index = child.index;
                        return <Layout cursor={ cursor } key={ index } node={ child } actions={ actions } />
                    })
                }
                <div ref="hover" className="hover"></div>
            </div>
        )
    }

    componentDidMount() {
        let { cursor, node } = this.props;
        let inspect = document.querySelector('.inspect');
        if(cursor == node.index && /cursor/.test(inspect.className)) this.refs.hover.className = 'hover show';
    }

    componentDidUpdate() {
        let { cursor, node } = this.props;
        let inspect = document.querySelector('.inspect');
        if(cursor == node.index && /cursor/.test(inspect.className)) this.refs.hover.className = 'hover show';
        else this.refs.hover.className = 'hover';
    }
}
