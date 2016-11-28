import React, { Component } from 'react';
import s from './index.css';

import Pannel from './Pannel';
import Layout from './Layout';

export class Main extends Component {
    render() {
        let { cursor, root, actions } = this.props;

        return (
            <div className={ s.settings }>
                <Pannel />
                <div className="content_settings hidden">
                    <Layout root={ root } cursor={ cursor } actions={ actions } />
                </div>
            </div>
        )
    }
}
