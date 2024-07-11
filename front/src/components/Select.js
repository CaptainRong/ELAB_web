import React,{useState} from 'react';
import { Container, Row,Tooltip, Col,Card,OverlayTrigger,FloatingLabel,Button,Badge, Modal, Form, Accordion, ListGroup} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CheckboxTree from 'react-checkbox-tree';
import {faUser,faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from './Image';

class UserItemShow{
    static dataTransition(items){
        if(items.length==0)
            return []
        var nodes={
            value:'全部',
            label:'全部',
            children:[]
        }
        var sorted={
            '极创组':{},
            '硬件组':{},
            '其他':[]
        }
        //将数据数据转换为叶子节点
        function leafTransition(node){
            var labelString=`${node.name}（${node.id}）`
            const renderTooltip = (props) => (
                <Tooltip style={{ display: 'inline-block' }} {...props}>
                    <Avatar size={100} src={node.avatar}/>
                </Tooltip>
              );
            var result={
                value:node.id,
                label:(
                    <span>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltip}
                        style={{ display: 'inline-block' }}
                        >
                        <span>{labelString}</span>
                    </OverlayTrigger>
                    </span>
                    )
            }
            return result
        }

        //按照部门和年级分类
        for(let i in items){
            if (items[i].department=='硬件组'||items[i].department=='极创组'){
                if (typeof items[i].grade=='number'){
                    if (sorted[items[i].department].hasOwnProperty(items[i].grade))
                        sorted[items[i].department][items[i].grade].push(items[i])
                    else{
                        sorted[items[i].department][items[i].grade]=[]
                        sorted[items[i].department][items[i].grade].push(items[i])
                    }
                }else{
                    if (sorted[items[i].department].hasOwnProperty('其他'))
                        sorted[items[i].department]['其他'].push(items[i])
                    else{
                        sorted[items[i].department]['其他']=[]
                        sorted[items[i].department]['其他'].push(items[i])
                    }
                }
            }else{
                sorted['其他'].push(items[i])
            }
        }

        //创造其他节点
        var otherNode={value:'其他',label:`其他（${sorted['其他'].length}）`,children:[]}
        for(let i in sorted['其他']){
            otherNode.children.push(leafTransition(sorted['其他'][i]))
        }
        nodes.children.push(otherNode)
        delete sorted['其他']

        //另外两个部门节点
        var jiChuangNode={value:'极创组',label:'极创组',children:[]}
        var hardwareNode={value:'硬件组',label:'硬件组',children:[]}

        function createNoode(name,node,data){
            for(let i in data){
                let temp={
                    value:name+':'+String(i),
                    label:`${i}级（${data[i].length}）`,
                    children:[]
                }
                for(let k in data[i])
                    temp.children.push(leafTransition(data[i][k]))
                node.children.push(temp)
            }
        }
        createNoode('极创组',jiChuangNode,sorted['极创组'])
        createNoode('硬件组',hardwareNode,sorted['硬件组'])

        nodes.children.push(jiChuangNode)
        nodes.children.push(hardwareNode)

        return [nodes]
    }
    static getIcons(){
        return {
            leaf: <FontAwesomeIcon icon={faUser} key='leaf' style={{ color: 'black'}}/>,
            parentOpen: <FontAwesomeIcon key='parentOpen' style={{ color: 'black'}} icon={faUserGroup} />,
            parentClose: <FontAwesomeIcon key='parentClose' style={{ color: 'black' }} icon={faUserGroup} />
        }
    }
}

/**
 * 选择对象组件
 * @param {string} title - 标题
 * @param {bool} show - 是否打开选择界面
 * @param {function} close - 关闭选择界面的回调函数
 * @param {function} ItemShow - 展示选项的类
 * @param {Array} items - 要展示的信息数组
 * @param {preselected} preselected - 预先选择的选项
 * @param {object} pros - 其他CheckboxTree中的参数
 * @param {function} finishedSelect - 用户完成选择的回调函数
 * @param {object} pros - gei
 */

function SelectItems({title,show,close,ShowItem:ItemShow,items,preselected: preSelected=[],finishedSelect,pros,
                        preExpend}){
    const [checked,setChecked]=useState(preSelected)
    const [expanded,setExpanded]=useState(preExpend)
    return(
        <Modal show={show} style={{ overflow: 'hidden' }} onHide={close} size="lg" scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CheckboxTree
                    {...pros}
                    style={{ width: '100%', height: '100%' }}
                    iconsClass="fa4"
                    nodes={ItemShow.dataTransition(items)}
                    icons={ItemShow.getIcons()}
                    checked={checked}
                    expanded={expanded}
                    onCheck={(checked) => setChecked(checked)}
                    onExpand={(expanded) => setExpanded(expanded)} showExpandAll/>

             </Modal.Body>
             <Modal.Footer>
                 <Button className='my-4' variant="outline-dark" onClick={()=>finishedSelect(checked)}>
                     <strong >确认</strong>
                 </Button>
             </Modal.Footer>
         </Modal>
    )
}
export {UserItemShow}
export default SelectItems
