import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Settings from '../lib/webcomponents/Settings';
import Layout from '../lib/webcomponents/Layout';

const name = Layout.constants.NAME;

class Root extends Component {
    render() {
        let state = this.props[name], actions = this.props.actions;
        let cursor = state.cursor, root = state['0'];
        return (
            <div className="wrapper">
                <Settings.views.Main cursor={ cursor } root={ root } actions={ actions } />
                <Layout.views.Client_render cursor={ cursor } node={ root } actions={ actions } />
            </div>
        )
    }
}

export default connect(state => {
    return {
        [name]: state[name]
    }
}, dispatch => ({
    actions: bindActionCreators(Layout.actions, dispatch)
}))(Root)
