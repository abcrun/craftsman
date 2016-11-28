import { IBTree } from '../../../../utils/IBTree';

var svg = (function(){
    var nodeRadius = 15, nodeLinkLine = 15, nodeWidth = nodeLinkLine + 2*nodeRadius, nodeHeight = 2*nodeRadius,
        parentSpace = 15, siblingsSpace = 5;
    var defaultColor = '#3F5765', hoverColor = '#FF530D';
    var that = this;
    var last;

    var walkdown = function(node){
        if(!node) return ;

        var level = node.level, x, y;
        if(node.prev){
            var lastChild = node.prev.lastChild;
            if(lastChild){
                //获取子孙节点中最后一个节点
                while(lastChild.lastChild){
                    lastChild = lastChild.lastChild;
                }

                y = lastChild.layout.y + nodeHeight + siblingsSpace;
            }else{
                y = node.prev.layout.y + nodeHeight + siblingsSpace;
            }
        }else{
            if(node.parent){
                y = node.parent.layout.y;
            }else{
                y = 80;//根节点
            }
        }
        node.layout = { x: level * (3*nodeRadius + parentSpace), y: y }


        if(node.firstChild) walkdown(node.firstChild);
        if(node.next){
            var next = node.next, parentSiblings = node.parent.next;
            if(next || parentSiblings){//父节点遍历下移调整位置
                var parentNode = next ? node.parent : parentSiblings.parent;
                while(parentNode){
                    var level = parentNode.level;
                    parentNode.layout = {
                        x: level * (nodeWidth + parentSpace),
                        y: parentNode.layout.y + (nodeRadius + siblingsSpace/2)
                    }

                    parentNode = parentNode.parent;
                }

                next ? walkdown(next) : walkdown(parentSiblings);
            }
        }
    }

    var render = function(cursor){
        var nodes = IBTree.IndexDB(), str = [];

        walkdown(nodes[0]);

        for(let key in nodes){
            if(key != 'cursor'){
                var node = nodes[key], x = node.layout.x, y = node.layout.y, index = node.index;
                var fontSize = 12;
                if(node.length){
                    if(node.length > 1){//兄弟节点连接线
                        var first = node.firstChild, last = node.lastChild;
                        var siblingsy1 = first.layout.y + nodeRadius, siblingsy2 = last.layout.y + nodeRadius, siblingsx = first.layout.x;
                        str.push('<line x1="' + siblingsx + '" y1="' + siblingsy1 + '" x2="' + siblingsx + '" y2="' + siblingsy2 + '" stroke="' + defaultColor + '" />')
                    }

                    //父子连接线
                    var descendanty = node.layout.y + nodeRadius, descendantx1 = node.layout.x + nodeWidth, descendantx2 = descendantx1 + parentSpace;
                    str.push('<line x1="' + descendantx1 + '" y1="' + descendanty + '" x2="' + descendantx2 + '" y2="' + descendanty + '" stroke="' + defaultColor + '" />')
                }

                str.push('<g data-index = "' + index + '">')

                var cls = index != cursor ? 'nodeDefault' : 'nodeHover';
                if(node.index == 0){
                    str.push('<use xlink:href="#root" x="' + (x + nodeRadius) + '" y="' + y + '" class="' + cls + '" />')
                }else{
                    str.push('<use xlink:href="#unit" x="' + x + '" y="' + y + '" class="' + cls + '" />')
                }
                str.push('<text x="' + (x + nodeRadius + nodeLinkLine) + '" y="' + (y + nodeRadius + fontSize/2) + '" font-size="' + fontSize + '" fill="#fff" text-anchor="middle">' + index + '</text>')

                str.push('</g>')

            }
        }

        return str.join('');
    }

    var mouseDown = function(event, cursor, doActions){
        var svg = this.refs.svg, group = this.refs.tree;
        var target = event.target, tag = target.nodeName;
        var tmpNode, tmpUseNode, tmpTextNode;
        var mdx = event.pageX, mdy = event.pageY, tmpux, tmpuy, tmptx, tmpty;
        var ts = /(-?\d+)\,(-?\d+)/.exec(group.getAttribute('transform') || 'translate(0,0)'),tx = parseInt(ts[1]), ty = parseInt(ts[2]);
        var actionsTree = this.refs.actions, 
            actionsTreeTs = /(-?\d+)\,(-?\d+)/.exec(actionsTree.getAttribute('transform') || 'translate(0,0)'),
            ax = parseInt(actionsTreeTs[1]), ay = parseInt(actionsTreeTs[2]);
        var from;

        var status = 0;//0 表示mousedown节点, 1表示mousedown画布, 2 表示move节点, 3表示move画布

        var mousemove = function(event){
            var target = event.target, tag = target.nodeName;
            var x = event.pageX, y = event.pageY,
                offsetX = x - mdx, offsetY = y - mdy;
            var node = target.parentNode;
            event.preventDefault();

            if((status == 0 || status == 2) && node.getAttribute('data-index') != '0'){//移动布局节点
                actionsTree.style.cssText = '';

                tmpUseNode.setAttribute('x', tx + tmpux + offsetX);
                tmpUseNode.setAttribute('y', ty + tmpuy + offsetY);
                tmpTextNode.setAttribute('x', tx + tmptx + offsetX);
                tmpTextNode.setAttribute('y', ty + tmpty + offsetY);

                status = 2;
            }else if(status == 1 || status == 3){//移动画面位置
                group.setAttribute('transform', 'translate(' + (tx + offsetX) + ',' + (ty + offsetY) + ')');
                actionsTree.setAttribute('transform', 'translate(' + (ax + offsetX) + ',' + (ay + offsetY)  + ')');

                status = 3;
            }else{//移动的根节点
                status = 3;
            }
        }

        var mouseup = function(event){
            var target = event.target, tag = target.nodeName;
            if(tmpNode){
                svg.removeChild(tmpNode);
                tmpNode = null;
            }

            if(status == 0){//点击事件，显示增加，删除，向前插入，向后插入功能
                if(/use|text/i.test(tag)){
                    node.style.cssText = '';

                    document.querySelector('.inspect').className = 'inspect cursor';
                    doActions.setCursor({ index:from })
                    actionsTree.style.cssText = 'display:block';
                }
            }else if(status == 2){//移动节点
                svg.addEventListener('mouseover', mouseover, false);
            }else if(status == 1){//点击画布

                actionsTree.style.cssText = 'display:none';
            }

            svg.removeEventListener('mousemove', mousemove);
            svg.removeEventListener('mouseup', mouseup);
            svg.removeEventListener('mouseleave', mouseleave);
        }

        var mouseover = function(event){
            var target = event.target, tag = target.nodeName;
            if(/use|text/i.test(tag)){
                var node = target.parentNode;
                var to = node.getAttribute('data-index');
                var isChildren = function(){
                    var toNode = IBTree.select(to);
                    while(toNode){
                        var index = toNode.index;
                        if(index == from) return true;
                        toNode = toNode.parent;
                    }
                    return false;
                }

                if(to == '0' || from == '0' || isChildren()){
                    svg.removeEventListener('mouseover', mouseover);
                    throw new Error('不允许此操作');
                    return;
                }
                if(from != to) doActions.move({ from, to });
            }

            svg.removeEventListener('mouseover', mouseover);
        }

        var mouseleave = function(event){
            if(tmpNode){
                svg.removeChild(tmpNode);
                tmpNode = null;
            }

            svg.removeEventListener('mousemove', mousemove);
            svg.removeEventListener('mouseup', mouseup);
            svg.removeEventListener('mouseleave', mouseleave);

        }

        if(/use|text/i.test(tag)){
            var node = target.parentNode, index = node.getAttribute('data-index');
            from = index;
            if(index == null) return;

            if(index != '0'){
                tmpNode = node.cloneNode(true);
                tmpUseNode = tmpNode.querySelector('use');
                tmpTextNode = tmpNode.querySelector('text');
                tmpNode.setAttribute('class', 'tmpNode');
                tmpUseNode.setAttribute('class', 'nodeHover');
                svg.appendChild(tmpNode);

                //聚合临时节点位置信息
                tmpux = parseInt(tmpUseNode.getAttribute('x'));
                tmpuy = parseInt(tmpUseNode.getAttribute('y'));
                tmptx = parseInt(tmpTextNode.getAttribute('x'));
                tmpty = parseInt(tmpTextNode.getAttribute('y'));

                tmpUseNode.setAttribute('x', tx + tmpux)
                tmpUseNode.setAttribute('y', ty + tmpuy)
                tmpTextNode.setAttribute('x', tx + tmptx)
                tmpTextNode.setAttribute('y', ty + tmpty)

                node.querySelector('use').setAttribute('class', 'nodeHover');
                node.style.cssText = 'opacity:.3';
            }
            status = 0;
        }else{
            status = 1;
        }

        svg.addEventListener('mousemove', mousemove, false)
        svg.addEventListener('mouseup', mouseup, false)
        svg.addEventListener('mouseleave', mouseleave, false)
    }

    return {
        render: render,
        mouseDown: mouseDown
    }
})();

export { svg };

