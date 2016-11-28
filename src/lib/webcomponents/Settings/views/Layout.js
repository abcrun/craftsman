import React, { Component } from 'react';
import s from './Layout.css';

import { IBTree } from '../../../utils/IBTree';
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

    render() {
        let { root, cursor, actions } = this.props;
        var svg_html = svg.render(cursor);

        return (
            <div className={ s.layout }>
                <div className="title">设置布局</div>
                <div className="intro">
                    <p className="desc">操作说明</p>
                    <p><span>+</span>:新增布局</p>
                    <p><span>-</span>:删除布局</p>
                    <p><span>前+</span>:向前增加布局</p>
                    <p><span>后+</span>:向后增加布局</p>
                    <p className="move">拖拽节点更改位置</p>
                </div>
                <div className="layout_settings">
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
        var cursor = this.props.cursor, node = IBTree.select(cursor),
            x = parseInt(ts[1]) + node.layout.x + 45, y = parseInt(ts[2]) + node.layout.y - 52;

        actions.setAttribute('transform', 'translate(' + x + ',' + y + ')')
        actions.style.cssText = 'display:block';
    }

    componentDidUpdate(prev){
        var tree = this.refs.tree, actions = this.refs.actions;
        var ts = /(-?\d+)\,(-?\d+)/.exec(tree.getAttribute('transform') || 'translate(0,0)')
        var cursor = this.props.cursor, node = IBTree.select(cursor),
            x = parseInt(ts[1]) + node.layout.x + 45, y = parseInt(ts[2]) + node.layout.y - 52;

        actions.setAttribute('transform', 'translate(' + x + ',' + y + ')')
        if(prev.cursor == cursor){
            actions.style.cssText = '';
        }else{
            actions.style.cssText = 'display:block';
        }
    }
}
