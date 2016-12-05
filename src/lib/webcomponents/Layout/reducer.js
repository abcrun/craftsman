import { handleActions } from 'redux-actions';
import * as T from './actionTypes';
import { NodeTree } from '../../utils/NodeTree';

let chooseBgColor = (p, prev) => {
    let themes = ['#FF6138', '#FFFF9D', '#BEEB9F', '#79BD8F', '#00A388'],
        pColor = p.data.styles.background || '', prevColor = prev ? prev.data.styles.background : '';
    return themes.filter((theme) => {
        return theme != pColor && theme != prevColor;
    })[parseInt(Math.random() * 3)];
}

let initData = {
    styles: {},
    components: []
}

NodeTree.init(initData);
let initialState = NodeTree.IndexDB();

export default handleActions({
    [T.ADD]: (state, action) => { 
        let { index } = action.payload, node = NodeTree.select(index);
        node.add({ styles: {}, components:[] });
        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.DELETE]: (state, action) => { 
        let { index } = action.payload;
        NodeTree.select(index).remove();

        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.INSERTBEFORE]: (state, action) => { 
        let { index } = action.payload, node = NodeTree.select(index);
        node.insertBefore({ styles: {}, components: [] });

        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.INSERTAFTER]: (state, action) => { 
        let { index } = action.payload, node = NodeTree.select(index);
        node.insertAfter({ styles: [], components: [] });

        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.MOVE]: (state, action) => { 
        let { from, to } = action.payload;
        NodeTree.move(from, to);

        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.SETCURSOR]: (state, action) => { 
        let { index } = action.payload;
        NodeTree.cursor(index);

        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.UPDATESTYLES]: (state, action) => { 
        let { index, styles } = action.payload;
        NodeTree.select(index).data.styles = styles;

        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.ADDCOMPONENT]: (state, action) => { 
        let { node, name } = action.payload;
        node.data.components.push({ name })

        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.REMOVECOMPONENT]: (state, action) => { 
        let { i, index } = action.payload;
        NodeTree.select(index).data.components.splice(i, 1);

        return Object.assign({}, NodeTree.IndexDB());
    },

    [T.SETCOMPONENT]: (state, action) => { 
        let { index, i, data } = action.payload;
        NodeTree.select(index).data.components[i].data = data; 

        return Object.assign({}, NodeTree.IndexDB());
    }

}, initialState);
