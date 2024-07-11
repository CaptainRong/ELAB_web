import { Container, Row,Figure,Tab,Tabs, Col,Card,Table,FloatingLabel,Button,Badge, Modal, Form, Accordion, ListGroup} from 'react-bootstrap';
import { RequireLogin } from '../Login';
import { RequirePermission } from '../Permission';
import { useEffect, useState } from 'react';
import config from '../../config';
import usePopupContext from '../../context/PopupContext';
import { DateTime,Duration } from 'luxon';
import {useForm,Controller} from 'react-hook-form'

function ManagerPanel(){
    return(
        <RequireLogin
        notlogin={<p>请登陆</p>}
        logined={<ManagerPanelHome/>}
        />
    )
}


function ManagerPanelHome(){
    return(
        <Card>
            <Card.Header>
                <Card.Title>管理面板</Card.Title>
            </Card.Header>
            <Card.Body>
                <Tabs
                    defaultActiveKey="info_release"
                    className="my-3 mx-3"
                >
                    <Tab eventKey="info_release" title='信息发布'>
                        <InfoRelease/>
                    </Tab>
                    <Tab eventKey="position" title='职务'>
                        <PositionSetting/>
                    </Tab>
                    <Tab eventKey="clock_in" title='打卡'>
                        <ClockInSetting/>
                    </Tab>
                    <Tab eventKey="sign_in" title='签到'>
                        <SignInSetting/>
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    )
}

function InfoRelease(){
    return(
        <Container>

        </Container>
    )
}

function PositionSetting(){
    return(
        <Container>
            
        </Container>
    )
}

function ClockInSetting(){
    //获取对应的设置信息
    const [setting,setSetting]=useState(null)
    const popup=usePopupContext()
    useEffect(()=>{
        fetch(config['API']['WEB_API']['get_setting']+'?setting_type=clock_in',{
            method:'GET',
            credentials:'include'
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){
                setSetting(result.data)
            }
            else
                popup(result.message)
        })
        .catch(error=>{
            popup('网络错误')
            console.error(error)
        })
    },[])

    function ClockInForm({settingInfo}){

    }

    return(
        <Container>
            {setting&&<ClockInForm settingInfo={setting}/>}        
        </Container>
    )
}

function SignInSetting(){
    const { control, handleSubmit, watch,setValue } = useForm({
        defaultValues:{
            title:'',
            start_time:'',
            end_time:'',
            sign_in_method:'common',
            sign_in_object:'hall',
            sign_in_result:'no',
        }
    })
    function SignInForm({settingInfo}){
        
    }
    return(
        <Container>
            
        </Container>
    )
}

export default ManagerPanel
