//react
import { Container, Row,Figure, Col,Card,Table,FloatingLabel,Button,Badge, Modal, Form, Accordion, ListGroup} from 'react-bootstrap';
import React, { useState } from 'react';
import {Routes,Route,Link,useParams} from 'react-router-dom'

//icon
import reimbursement_apply_icon from './icons/reimbursement_apply.svg'
import research_assistant_apply_icon from './icons/research_assistant_apply_icon.svg'
import elab_calendar_icon from './icons/elab_calendar_icon.svg'
import award_apply_icon from './icons/award_apply_icon.svg'
import score_inquiry_icon from './icons/score_inquiry_icon.svg'
import material_management_icon from './icons/material_management_icon.svg'
import member_list_icon from './icons/member_list_icon.svg'
import manager_panel_icon from './icons/manager_panel_icon.svg'
import sign_in_sytem_icon from './icons/sign_in_icon.svg'
//服务组件
import ResearchAssistantApply from '../components/Service/ResearchAssistantApply'
import ReimbursementApply from '../components/Service/ResearchAssistantApply'
import ElabCalendar from '../components/Service/ElabCalendar';
import MaterialManagementSystem from '../components/Service/MaterialManagementSystem';
import MemberList from '../components/Service/MemberList';
import ManagerPanel from '../components/Service/ManagerPanel'
import SignInSystem from '../components/Service/SignInSystem';
import ClockInSystem from '../components/Service/ClockInSystem';

import { useUserContext } from '../context/UserContext';
import config from '../config';

class ShowService{
    constructor(rowNumber=4) {
        this.items=[];
        this.rowNumber=rowNumber
    }
    add(item){
        this.items.push(item)
    }
    addList(items){
        this.items=this.items.concat(items)
    }
    Show(){
        var rows=[]
        var row=[]
        function TransitionToJSX(items){
            return (
                <Row className='my-5'>
                    {items}
                </Row>
            )
        }
        for (var item in this.items){
            item=this.items[item]
            row.push(item)
            if (row.length==this.rowNumber){
                rows.push(TransitionToJSX(row))
                row=[]
            }
        }
        if(row.length!=0)
            rows.push(TransitionToJSX(row))
        return(
            <Container>
                {rows}
            </Container>
        )
    }
}


function OfficeHall(){
    return(
        <Card>
            <OfficeHallRoute/>
        </Card>
    )
}

function OfficeHallRoute(){
    return(
        <Routes basePath='/office-hall'>
            <Route path='/' element={<ServiceItems/>}/>
            <Route path='/research-assistant-apply' element={<ResearchAssistantApply/>}/>
            <Route path='/reimbursement-apply' element={<ReimbursementApply/>}/>
            <Route path='/elab-calendar' element={<ElabCalendar/>}/>
            <Route path='/material-management' element={<MaterialManagementSystem/>}/>
            <Route path='/member-list' element={<MemberList/>}/>
            <Route path='/manager-panel' element={<ManagerPanel/>}/>
            <Route path='/sign-in/*' element={<SignInSystem/>}/>
            <Route path='/clock-in/*' element={<ClockInSystem/>}/>
        </Routes>
    )
}

function ServiceItems(){
    const serviceList =new ShowService()
    const [userManger,state]=useUserContext()
    serviceList.addList([
        <ServiceItem 
        key='reimbursement_apply'
        icon={reimbursement_apply_icon} 
        title='报销申请'
        url='/office-hall/reimbursement-apply'/>,
        <ServiceItem 
        key='research_assistant_apply'
        icon={research_assistant_apply_icon} 
        title='科研助手申请'
        url='/office-hall/research-assistant-apply'/>,
        <ServiceItem
        key='elab_calendar'
        icon={elab_calendar_icon}
        title='科中日历'
        url='/office-hall/elab-calendar'/>,        
        <ServiceItem
        key='award_apply'
        icon={award_apply_icon}
        title='获奖申请'                
        url=''/>,
        <ServiceItem 
        key='score_inquiry'
        icon={score_inquiry_icon} 
        title='成绩查询'
        url=''/>,
        <ServiceItem 
        key='material_management'
        icon={material_management_icon} 
        title='物料管理系统'
        url='/office-hall/material-management'/>,
        <ServiceItem 
        key='member_list'
        icon={member_list_icon} 
        title='成员列表'
        url='/office-hall/member-list'/>,
        <ServiceItem 
        key='sign_in'
        icon={sign_in_sytem_icon} 
        title='签到'
        url='/office-hall/sign-in'/>,
        <ServiceItem 
        key='clock_in'
        icon={sign_in_sytem_icon} 
        title='打卡'
        url='/office-hall/clock-in'/>,
    ])

    //只有管理员才能看见
    if(state.permission&&state.permission.includes(config['PERMISSION']['view_admin_panel']))
        serviceList.add(        
            <ServiceItem 
            key='manager_panel'
            icon={manager_panel_icon} 
            title='管理'
            url='/office-hall/manager-panel'/>)

    return(
        <div>
            <Card.Header>
                <Card.Title>服务</Card.Title>
            </Card.Header>
            <Card.Body>
                <Container>
                    {serviceList.Show()}
                </Container>
            </Card.Body>
        </div>
    )
}

function ServiceItem({icon,url,title}){
    return(
        <Col className='col-3 text-center' >
            <Link to={url}>
                <Figure>
                    <Figure.Image
                        width={36}
                        height={36}
                        src={icon}
                    />
                    <Figure.Caption>
                        {title}
                    </Figure.Caption>
                </Figure>
            </Link>
        </Col>
    )
}


export default OfficeHall