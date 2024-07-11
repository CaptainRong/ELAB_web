import { Container, Row,Tab,Tabs, Col,Card,Table,Button,Badge, Modal, Accordion, ListGroup} from 'react-bootstrap';
import { Route,Routes,Link,useNavigate,useParams } from 'react-router-dom';
import {useForm,Controller} from 'react-hook-form'

import { RequireLogin } from "../Login"
import config from '../../config';
import { RequirePermission } from '../Permission';
import InitiateSignInForm from '../../form/InitiateSignInForm';
import { useEffect, useState} from 'react';
import SelectItems,{UserItemShow} from '../Select'
import usePopupContext from '../../context/PopupContext';
import { result } from 'lodash';
import { DateTime,Duration,Interval } from 'luxon';
import useModalShow from '../../hook/useModalShow';

//打卡系统
function ClockInSystem(){
    return<RequireLogin
            logined={<ClockInSystemRoute/>}
            notlogin={<p>请登录</p>}
            />
}
//打卡系统的路由
function ClockInSystemRoute(){
    return(
        <Routes basePath='/office-hall/clock-in'>
            <Route path='' element={<ClockInSystemHome/>}/>
        </Routes>
    )
}

//打卡系统的主页
function ClockInSystemHome(){
    //用户的打卡状态
    const navigate = useNavigate()
    const [userStatus,setUserStatus]=useState('')
    const popup=usePopupContext()
    const statusMap={
        'nodone':'没有打卡',
        'doing':'正在打卡',
        'overtime':'打卡超时',
    }
    const [fresh,SetFresh]=useState(0)

    const [setShow,ShowModal,setContent]=useModalShow()

    //获取用户的打卡状态
    useEffect(()=>{
        fetch(config['API']['SERVICE_API']['clock_in_system']['get_status'],{
            method:'GET',
            credentials:'include'
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){
                result.data.all_duration=Duration.fromObject({ seconds: result.data.all_duration })
                result.data.this_week_duration=Duration.fromObject({ seconds: result.data.this_week_duration })
                result.data.last_week_duration=Duration.fromObject({ seconds: result.data.last_week_duration })
                result.data.duration=Duration.fromObject({seconds:DateTime.now().toSeconds()-result.data.start_time})
                setUserStatus(result.data)
            }
            else
                popup(result.message)
        })
        .catch(error=>{
            popup('网络错误')
            console.error(error)
        })
    },[fresh])

    function StartClock(){
        function StartClockFunction(){
            fetch(config['API']['SERVICE_API']['clock_in_system']['start_clock_in'],{
                method:'GET',
                credentials:'include'
            })
            .then(response=>response.json())
            .then(result=>{
                if(result.result=='ok'){
                    result.data.start_time=DateTime.fromSeconds(result.data.start_time)
                    setContent({
                        title:'开始打卡',
                        body:`开始时间:${result.data.start_time.toFormat('HH:mm:ss')}`
                    })
                    setShow(true)
                    SetFresh(fresh+1)
                }
                else
                    popup(result.message)
            })
            .catch(error=>{
                popup('网络错误')
                console.error(error)
            })
        }

        return (
            <Button style={{ width: 'auto',height:'auto' }} onClick={StartClockFunction}>开始打卡</Button>
        )
    }
    function EndClock(){

        function EndClockFunction(){
            fetch(config['API']['SERVICE_API']['clock_in_system']['end_clock_in'],{
                method:'GET',
                credentials:'include'
            })
            .then(response=>response.json())
            .then(result=>{
                if(result.result=='ok'){
                    result.data.start_time=DateTime.fromSeconds(result.data.start_time)
                    result.data.end_time=DateTime.fromSeconds(result.data.end_time)
                    result.data.duration_time=Duration.fromObject({ seconds: result.data.duration })
                    setContent({
                        title:'结束打卡',
                        body:<>
                                <p>{`开始时间:${result.data.start_time.toFormat('HH:mm:ss')}`}</p>
                                <p>{`结束时间:${result.data.end_time.toFormat('HH:mm:ss')}`}</p>
                                <p>{`持续时间:${result.data.duration_time.toFormat('HH:mm:ss')}`}</p>
                            </>
                    })
                    setShow(true)
                    SetFresh(fresh+1)
                }
                else
                    popup(result.message)
            })
            .catch(error=>{
                popup('网络错误')
                console.error(error)
            })
        }
        return (
            <Button style={{ width: 'auto',height:'auto' }} onClick={EndClockFunction}>停止打卡</Button>
        )
    }
    function ClockOverTime(){
        return (
            <Button style={{ width: 'auto',height:'auto' }}>超时确认</Button>
        )
    }

    return(
        <Card>
            <Card.Header><Card.Title>打卡</Card.Title></Card.Header>
            <Card.Body>
                {ShowModal}

                <Container>
                    <Row>
                        状态：{userStatus!=''&&statusMap[userStatus.status]}
                    </Row>
                    <Row>
                        正在打卡时长：{userStatus!=''&&userStatus.duration.toFormat('hh:mm:ss')} 
                    </Row>
                    <Row>
                        本周打卡时长：{userStatus!=''&&userStatus.this_week_duration.toFormat('hh:mm:ss')}
                    </Row>
                    <Row>
                        本周打卡时长是否满足：{userStatus!=''&&userStatus.this_week_meeting}
                    </Row>
                    <Row>
                        上周打卡时长：{userStatus!=''&&userStatus.last_week_duration.toFormat('hh:mm:ss')}
                    </Row>
                    <Row>
                        上周打卡时长是否满足：{userStatus!=''&&userStatus.last_week_meeting}
                    </Row>
                    <Row>
                        打卡总时长：{userStatus!=''&&userStatus.all_duration.toFormat('hh:mm:ss')}
                    </Row>
                    <Row>
                        {userStatus!=''&&userStatus.status=='nodone'&&<StartClock/>}
                        {userStatus!=''&&userStatus.status=='doing'&&<EndClock/>}
                        {userStatus!=''&&userStatus.status=='overtime'&&<ClockOverTime/>}
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}

export default ClockInSystem