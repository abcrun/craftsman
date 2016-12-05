import React, { Component } from 'react';
import s from './Pannel.css';

import FontAwesome from 'react-fontawesome';


export default class Pannel extends Component {
    inspect() {
        let inspect = this.refs.inspect, cls = inspect.className;
        if(/cursor/.test(cls)){
            inspect.className = 'inspect';
        }else{
            inspect.className = 'inspect cursor';
        }
    }

    configLayout() {
        let layout = this.refs.layout, settings = document.querySelector('.content_settings');
        let cls = settings.className;

        if(/hidden/.test(cls)){
            layout.className = 'layout current';
            settings.className = 'content_settings';
            settings.parentNode.style.cssText = 'width:336px;';
        }else{
            layout.className = 'layout';
            settings.className = 'content_settings hidden';
            settings.parentNode.style.cssText = '';
        }
    }

    render() {
        return (
            <div className={ s.pannel }>
                <div ref="inspect" className="inspect" onClick={ this.inspect.bind(this) } >
                    <FontAwesome name="location-arrow" className="arrow" />
                    <div className="tip">点击在页面选择需要修改的布局</div>
                </div>
                <div ref="layout" className="layout" onClick={ this.configLayout.bind(this) } >
                    <FontAwesome name="cogs" />
                    <div className="tip">设置布局(添加/删除/移动/修改样式)</div>
                </div>
            </div>
        )
    }
}
