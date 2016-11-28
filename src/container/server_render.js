import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Layout from '../lib/webcomponents/Layout';


const name = Layout.constants.NAME;

class Root extends Component {
    render() {
        let state = this.props[name], root = state['0'];
        return (
            <div className="BBlockWrapper">
                <Layout.views.server_render node={ root } />
            </div>
        )
    }
}

export default connect(state => {
    return {
        [name]: state[name]
    }
})(Root)
