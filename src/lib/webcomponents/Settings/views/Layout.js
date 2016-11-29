import React, { Component } from 'react';
import s from './Layout.css';

import { NodeTree } from '../../../utils/NodeTree';
import { svg } from './utils/svg_render';

export default class Layout extends Component {
    mouseDown(e, cursor, actions) {
        svg.mouseDown.call(this, e, cursor, actions);
    }

    actions(e, type, index, actions){
        switch(type){
            case 'add':
                actions.add({ index });
                break;
            case 'remove':
                actions.remove({ index });
                break;
            case 'insertBefore':
                actions.insertBefore({ index });
                break;
            case 'insertAfter':
                actions.insertAfter({ index });
                break;
        }
    }

    updateStyles(index, actions) {
        let margin = this.refs.margin_top.value + ' ' + this.refs.margin_right.value + ' ' + this.refs.margin_bottom.value + ' ' + this.refs.margin_left.value;
        let padding = this.refs.padding_top.value + ' ' + this.refs.padding_right.value + ' ' + this.refs.padding_bottom.value + ' ' + this.refs.padding_left.value;
        let width = this.refs.width.value, height = this.refs.height.value;

        let styles = { width, height, padding, margin };
        actions.updateStyles({ index, styles})
    }

    select(event) {
        let elm = event.target;
        elm.style.cssText = 'border:solid 1px #bdd4de';
        elm.select();
    }

    blur(event) {
        let elm = event.target;
        elm.style.cssText = '';
    }

    render() {
        let { root, cursor, actions } = this.props,
            node = NodeTree.select(cursor), 
            styles = node.data.styles;
        let svg_html = svg.render(cursor);

        let width = styles.width || '100%', height = styles.height || '100px',
            margins = (styles.margin || '0 auto 0 auto').split(' '),
            paddings = (styles.padding || '- - - -').split(' ');

        let margin_top = margins[0],
            margin_right = margins[1],
            margin_bottom = margins[2],
            margin_left = margins[3];
        let padding_top = paddings[0],
            padding_right = paddings[1],
            padding_bottom = paddings[2],
            padding_left = paddings[3];

        return (
            <div className={ s.layout }>
                <div className="title">布局</div>
                <div className="intro">
                    <p className="desc">操作说明</p>
                    <p><span>+</span>:新增布局</p>
                    <p><span>-</span>:删除布局</p>
                    <p><span>前+</span>:向前增加布局</p>
                    <p><span>后+</span>:向后增加布局</p>
                    <p className="move">拖拽节点更改位置</p>
                </div>
                <div className="layout_settings">
                    <div className="box">
                        <div className="margin">
                            <div className="hoz hoztop">
                                <input type="text" ref="margin_top" value={ margin_top } onChange={ this.updateStyles.bind(this, cursor, actions) } onFocus={ e => this.select(e) } onBlur={ e => this.blur(e) } />
                            </div>
                            <div className="hoz hozbottom">
                                <input type="text" ref="margin_bottom" value={ margin_bottom } onChange={ this.updateStyles.bind(this, cursor, actions) } onFocus={ e => this.select(e) } onBlur={ e => this.blur(e) }  />
                            </div>
                            <div className="ver verleft">
                                <input type="text" ref="margin_left" value={ margin_left } onChange={ this.updateStyles.bind(this, cursor, actions) } onFocus={ e => this.select(e) } onBlur={ e => this.blur(e) }  />
                            </div>
                            <div className="ver verright">
                                <input type="text" ref="margin_right" value={ margin_right } onChange={ this.updateStyles.bind(this, cursor, actions) } onFocus={ e => this.select(e) } onBlur={ e => this.blur(e) }  />
                            </div>

                            <div className="padding">
                                <input type="text" className="width" ref="width" value={ width } onChange={ this.updateStyles.bind(this, cursor, actions) } onFocus={ e => this.select(e) } onBlur={ e => this.blur(e) }  />
                                &times; 
                               <input type="text" className="height" ref="height" value={ height } onChange={ this.updateStyles.bind(this, cursor, actions) } onFocus={ e => this.select(e) } onBlur={ e => this.blur(e) }  />
                            </div>
                        </div>
                    </div>
                    <div className="advanced">
                        <div className="content">
                            <div className="item">
                            </div>
                        </div>
                    </div>
                </div>
                <div className="svg">
                    <svg ref="svg"
                        onMouseDown={ e => this.mouseDown(e, cursor, actions) } >
                        <defs>
                            <g id="root">
                                <circle cx="15" cy="15" r="15" />
                            </g>
                            <g id="unit">
                                <line x1="0" y1="15" x2="15" y2="15" />
                                <circle cx="30" cy="15" r="15" />
                            </g>
                        </defs>

                        <g ref="tree" className="tree" 
                            dangerouslySetInnerHTML={{__html: svg_html}}></g>
                        <g ref="actions" className="actions">
                                <line x1="15" y1="15" x2="30" y2="15" />
                                <g onClick={ e => this.actions(e, 'add', cursor, actions) }>
                                    <circle cx="45" cy="15" r="15"  />
                                    <text x="45" y="22">+</text>
                                </g>

                                <g onClick={ e => this.actions(e, 'remove', cursor, actions) }>
                                    <line x1="15" y1="50" x2="30" y2="50" />
                                    <circle cx="45" cy="50" r="15"  />
                                    <text x="45" y="57">-</text>
                                </g>

                                <g onClick={ e => this.actions(e, 'insertBefore', cursor, actions) }>
                                    <line x1="15" y1="85" x2="30" y2="85" />
                                    <circle cx="45" cy="85" r="15"  />
                                    <text x="45" y="90" fontSize="12">前+</text>
                                </g>

                                <g onClick={ e => this.actions(e, 'insertAfter', cursor, actions) }>
                                    <line x1="15" y1="120" x2="30" y2="120" />
                                    <circle cx="45" cy="120" r="15"  />
                                    <text x="45" y="125" fontSize="12">后+</text>
                                </g>

                                <line x1="15" y1="15" x2="15" y2="120" />
                                <line x1="0" y1="67" x2="15" y2="67" />
                            </g>
                    </svg>
                </div>
            </div>
        )
    }

    componentDidMount(){
        var tree = this.refs.tree, actions = this.refs.actions;
        var ts = /(-?\d+)\,(-?\d+)/.exec(tree.getAttribute('transform') || 'translate(0,0)')
        var cursor = this.props.cursor, node = NodeTree.select(cursor),
            x = parseInt(ts[1]) + node.layout.x + 45, y = parseInt(ts[2]) + node.layout.y - 52;

        actions.setAttribute('transform', 'translate(' + x + ',' + y + ')')
        actions.style.cssText = 'display:block';
    }

    componentDidUpdate(prev){
        var tree = this.refs.tree, actions = this.refs.actions;
        var ts = /(-?\d+)\,(-?\d+)/.exec(tree.getAttribute('transform') || 'translate(0,0)')
        var cursor = this.props.cursor, node = NodeTree.select(cursor),
            x = parseInt(ts[1]) + node.layout.x + 45, y = parseInt(ts[2]) + node.layout.y - 52;

        actions.setAttribute('transform', 'translate(' + x + ',' + y + ')')
        if(prev.cursor == cursor){
            actions.style.cssText = '';
        }else{
            actions.style.cssText = 'display:block';
        }
    }
}
