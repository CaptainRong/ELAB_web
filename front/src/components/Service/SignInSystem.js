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
import { DateTime } from 'luxon';

function SignInSystem(){
    return<RequireLogin
            logined={<SignInSystemRoute/>}
            notlogin={<p>请登录</p>}
            />
}

function SignInSystemRoute(){
    return(
        <Routes basePath='/office-hall/sign-in/*'>
            <Route path='' element={<SignInSystemHome/>}/>
            <Route path='/records' element={
                        <RequirePermission
                        required={'initiate_sign_in'}
                        allow={<SignInRecords/>}
                        notallow={null}
                        />}/>
            <Route path='/record/:id' element={                        
                    <RequirePermission
                        required={'initiate_sign_in'}
                        allow={<SignInRecord/>}
                        notallow={null}
                        />}/>
            <Route path='/initiate' element={                        
                        <RequirePermission
                        required={'initiate_sign_in'}
                        allow={<InitiateSignIn/>}
                        notallow={null}
                        />}/>
            <Route path='/details/:id' element={<SignInDetails/>}/>
        </Routes>
    )
}
//签到细节
function SignInDetails(){
    const signInMethod={
        'common':'普通签到',
        'QRcode':'二维码签到'
    }
	const { id } = useParams();
    const [signIn,setSignIn]=useState('')
    const popup=usePopupContext()
    const navigate=useNavigate()
    //获取签到信息
    useEffect(()=>{
        fetch(config['API']['SERVICE_API']['sign_in_system']['get_details']+`?id=${id}`,{
            method:'GET',
            credentials:'include'
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){
                //转换时间
                result.data.initiate_time= DateTime.fromMillis(result.data.initiate_time*1000)
                result.data.start_time= DateTime.fromFormat(result.data.start_time,'HH:mm:ss')
                result.data.end_time= DateTime.fromFormat(result.data.end_time,'HH:mm:ss')
                setSignIn(result.data)
            }
            else
                popup(result.message)
        })
        .catch(error=>{
            popup('网络错误')
            console.error(error)
        })
    },[])

    function checkIn(){
        fetch(config['API']['SERVICE_API']['sign_in_system']['check_in']+`?sign_in_id=${id}`,{
            method:'GET',
            credentials:'include',
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){
                popup('签到成功')
                navigate('/')
            }
            else
                popup(result.message)
        })
        .catch(error=>{
            popup('网络错误')
            console.error(error)
        })
    }

    function CommonSignInButton({disable}){

        return (
            <Button 
            style={{ width: 'auto',height:'auto' }} 
            disabled={disable} 
            variant="outline-primary" 
            onClick={checkIn}>
                签到
            </Button>
        )
    }

    function QRcodeSignInButton({disable}){
        const popup=usePopupContext()
        return (
            <Button 
            style={{ width: 'auto',height:'auto' }} 
            disabled={disable}
            onClick={()=>popup('请联系管理员获取二维码，然后前往移动端扫码签到')} 
            variant="outline-primary" >
                扫码
            </Button>
        )
    }
    
    return(
        <Card>
            <Card.Footer><Card.Title>{signIn.title}</Card.Title></Card.Footer>
            <Card.Body>
                <Container>
                    <Row>
                        发起人：{signIn!=''&&signIn.initiator_name}
                    </Row>
                    <Row>
                        发起时间：{signIn!=''&&signIn.initiate_time.toFormat('yyyy-MM-dd HH:mm:ss')}
                    </Row>                    
                    <Row>
                        开始时间：{signIn!=''&&signIn.start_time.toFormat('HH:mm')}
                    </Row>
                    <Row>
                        结束时间：{signIn!=''&&signIn.end_time.toFormat('HH:mm')}
                    </Row>
                    <Row>
                        签到方式：{signIn!=''&&signInMethod[signIn.sign_in_method]}
                    </Row>
                    <Row>
                        {signIn!=''&&signIn.sign_in_method=='common'&&
                        <CommonSignInButton 
                        disable={signIn.state!='doing'}/>}
                        {signIn!=''&&signIn.sign_in_method=='QRcode'&&
                        <QRcodeSignInButton 
                        disable={signIn.state!='doing'}/>}
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}

//主页
function SignInSystemHome(){
    const [personalSignIn,setPersonalSignIn]=useState([])
    const [hallSignIn,setHallSignIn]=useState([])
    const popup=usePopupContext()
    //签到信息
    function SignInItem({signIn,target}){
        const navigate = useNavigate();
        return(
            <ListGroup.Item
            as="button"
            className="d-flex justify-content-between align-items-start" 
            onClick={()=>navigate(`${target}/${signIn['id']}`)}
            action
            >
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{signIn['title']}</div>
                    {signIn['initiate_time'].toFormat('yyyy-MM-dd HH:mm:ss')}
                </div>
                {signIn['initiator_name']}
            </ListGroup.Item>
        )
    }
    //获取个人签到
    useEffect(()=>{
        fetch(config['API']['SERVICE_API']['sign_in_system']['get_personal_sign_in'],{
            method:'GET',
            credentials: 'include',
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){
                //将时间戳转换
                console.log(result.data)

                for(let i in result.data){
                    result.data[i].initiate_time=new DateTime(result.data[i].initiate_time*1000)
                }
                console.log(result.data)
                setPersonalSignIn(result.data)
            }
        })
        .catch(error=>{
            console.log(error)
            popup('网络错误')
        })
    },[])
    //获取大厅签到
    useEffect(()=>{
        fetch(config['API']['SERVICE_API']['sign_in_system']['get_hall_sign_in'],{
            method:'GET',
            credentials: 'include',
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){
                for(let i in result.data){
                    result.data[i].initiate_time=DateTime.fromMillis(result.data[i].initiate_time*1000)
                }
                setHallSignIn(result.data)
            }
        })
        .catch(error=>{
            console.log(error)
            popup('网络错误')
        })
    },[])

    //管理员操作按钮
    function AdminPanel(){
        return(
            <Container className='fs-6'>
                <Row className='my-3'>
                    <Link to='/office-hall/sign-in/initiate' style={{ textDecoration: 'none' }}>
                        <strong>发起签到</strong>
                    </Link>
                </Row>
                <Row className='my-3'>
                    <Link to='/office-hall/sign-in/records' style={{ textDecoration: 'none' }}>
                        <strong>签到记录</strong>
                    </Link>
                </Row>
                </Container>
        )
    }
    return(
        <Card>
            <Card.Header>
                <Card.Title>签到系统</Card.Title>
            </Card.Header>
            <Card.Body>              
                <Tabs
                defaultActiveKey="hall"
                id="sign-in"
                className="my-3 mx-3"
                >
                    <Tab eventKey="hall" title="签到大厅" >
                        <ListGroup variant="flush" >
                            {hallSignIn.map((item)=>(
                               <SignInItem signIn={item} target={'/office-hall/sign-in/details'}/>
                            ))}
                        </ListGroup>
                    </Tab>
                    <Tab eventKey="personal" title="个人签到">
                        <ListGroup variant="flush" >
                            {personalSignIn.map((item)=>(
                               <SignInItem signIn={item} target={'/office-hall/sign-in/details'}/>
                            ))}
                        </ListGroup>
                    </Tab>
                </Tabs>
                
            </Card.Body>
            <Card.Footer>
                <RequirePermission
                    required={'initiate_sign_in'}
                    allow={<AdminPanel/>}
                    notallow={null}
                    />
            </Card.Footer>
        </Card>
    )
}

//发起签到
function InitiateSignIn(){
	const navigate = useNavigate();
    const popup=usePopupContext()
    const [receivers,setReceivers]=useState([])
    const { control, handleSubmit, watch,setValue } = useForm({
        defaultValues:{
            title:'',
            start_time:'',
            end_time:'',
            sign_in_method:'common',
            sign_in_object:'hall',
            sign_in_result:'no',
        }
    });
    const [signInObject,setSignInObject]=useState(watch('sign_in_object'))
    
    //自定义签到对象
    function CustomSignInObject(){
        const [show,setshow]=useState(false)
        const [users,setUsers]=useState([])
        //获取可以签到的对象
        useEffect(()=>{
            fetch(config['API']['SERVICE_API']['sign_in_system']['able_object'],{
                method:'GET',
                credentials: 'include',
            })
            .then(response=>response.json())
            .then(result=>{
                if(result.result=='ok'){
                    setUsers(result.data)
                }else{
			        // popup('网络错误','错误','information') 
                    // 此处使用popup会不断重新渲染InitiateSignIn组件，导致不断发起请求
                    // 原因未知
                    alert(result.message);

                }
            })
            .catch(error=>{
                console.log(error)
                alert(result.message)
                // popup('网络错误')
                // 此处使用popup会不断重新渲染InitiateSignIn组件,导致不断发起请求
                // 原因未知
            })
        },[])
        //选择签到对象完成
        function finishedSelect(data){
            setReceivers(data)
            setshow(false)
        }

        return(
            <div>
                <SelectItems
                title='选择签到对象'
                show={show}
                close={()=>setshow(false)}
                ShowItem={UserItemShow}
                items={users}
                preselected={receivers}
                finishedSelect={finishedSelect}
                preExpend={['全部','极创组','硬件组']}
                />
                <Row className='my-4'>
                    <Col>
                        <Button onClick={()=>{setshow(true)}} style={{width:'auto'}} variant='light'>
                            <strong>自定义签到对象</strong>
                        </Button>
                    </Col>
                    <Col>
                        {receivers.length==0?'没有选择接受对象':`已选择${receivers.length}人`}
                    </Col>
                </Row>
            </div>
        )
    }

    //提交表单
    function submitForm(data){
        if (data['sign_in_object']=='custom'&&receivers.length==0){
            popup('请添加自定义签到对象')
            return 
        }
        if (data['sign_in_object']=='custom')
            data.receivers_id=receivers
        else
            data.receivers_id=null
        
        fetch(config['API']['SERVICE_API']['sign_in_system']['initiate_sign_in'],{
            credentials:'include',
            method:'POST',
            body: JSON.stringify(data),
            headers:{
				'Content-Type': 'application/json'
			}
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){
                popup('签到发送成功')
                navigate('/office-hall/sign-in')
            }else{
                popup(result.message)
            }
        })
        .catch(error=>{
            popup(error)
            console(error)
        })
    }

    return(
        <Card>
            <Card.Header>
                <Card.Title style={{color: 'blue'}}>发起签到</Card.Title>
            </Card.Header>
            <Card.Body>
                <InitiateSignInForm
                control={control}
                customSignInObject={signInObject=='custom'?<CustomSignInObject/>:null}
                setSignInObject={setSignInObject}
                setValue={setValue}
                submitForm={handleSubmit(submitForm)}
                />
            </Card.Body>
        </Card>
    )
}

//签到记录
function SignInRecords(){
    const [signIn,setSignIn]=useState([])
    const popup=usePopupContext()
    const stateMap={
        doing:'正在进行',
        done:'已完成',
        no:'未开始',
    }
    //获取记录信息
    useEffect(()=>{
        fetch(config['API']['SERVICE_API']['sign_in_system']['get_records'],{
            credentials:'include',
            method:'GET',
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){
                for(let i in result.data){
                    result.data[i].initiate_time=DateTime.fromMillis(result.data[i].initiate_time*1000)
                }
                setSignIn(result.data)
            }else{
                popup(result.message)
            }
        })
        .catch(error=>{
            popup(error)
            console(error)
        })
    },[])
    //签到信息
    function SignInItem({signIn,target}){
        const navigate = useNavigate();
        return(
            <ListGroup.Item
            as="button"
            className="d-flex justify-content-between align-items-start" 
            onClick={()=>navigate(`${target}/${signIn['id']}`)}
            action
            >
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{signIn['title']}</div>
                    {signIn['initiate_time'].toFormat('yyyy-MM-dd HH:mm:ss')}
                </div>
                {stateMap[signIn['state']]}
            </ListGroup.Item>
        )
    }
    return (
        <Card>
            <Card.Header><Card.Title>签到记录</Card.Title></Card.Header>
            <Card.Body>
                <ListGroup variant="flush" >
                    {signIn.map((item)=>(
                        <SignInItem signIn={item} target={'/office-hall/sign-in/record'}/>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    )
}
//签到记录
function SignInRecord(){
    const stateMap={
        doing:'正在进行',
        done:'已完成',
        no:'未开始',
    }
    const methodMap={
        common:'普通签到',
        QRcode:'二维码签到'
    }
    const { id } = useParams();
    const [signIn,setSignIn]=useState(null)
    const popup=usePopupContext()
    //获取记录
    useEffect(()=>{
        fetch(config['API']['SERVICE_API']['sign_in_system']['get_record']+`?id=${id}`,{
            credentials:'include',
            method:'GET',
        })
        .then(response=>response.json())
        .then(result=>{
            if(result.result=='ok'){     
                //设置时间
                result.data.initiate_time= DateTime.fromMillis(result.data.initiate_time*1000)
                result.data.start_time= DateTime.fromFormat(result.data.start_time,'HH:mm:ss')
                result.data.end_time= DateTime.fromFormat(result.data.end_time,'HH:mm:ss')
                result.data.finished=result.data.sign_in_object.finished.map((item)=>{return item['name']})
                if (result.data.sign_in_object.type=='custom')
                    result.data.unfinished=result.data.sign_in_object.unfinished.map((item)=>{return item['name']})
                setSignIn(result.data)
            }else{
                popup(result.message)
            }
        })
        .catch(error=>{
            popup(String(error))
            console.error(error)
        })
    },[])
    return (
        <div>
            {signIn!=null&&
            <Card>
                <Card.Header><Card.Title></Card.Title></Card.Header>
                <Card.Body>
                    <Container>
                        <Row>
                            标题：{signIn.title}
                        </Row>
                        <Row>
                            状态：{stateMap[signIn.state]}
                        </Row>                        
                        <Row>
                            发起时间：{signIn.initiate_time.toFormat('yyyy-MM-dd HH:mm:ss')}
                        </Row>                        
                        <Row>
                            开始时间：{signIn.start_time.toFormat('HH:mm')}
                        </Row>                        
                        <Row>
                            结束时间：{signIn.end_time.toFormat('HH:mm')}
                        </Row>                        
                        <Row>
                            签到方式：{methodMap[signIn.sign_in_method.type]}
                        </Row>
                        {signIn.sign_in_method.type!='QRcode'&&signIn.state=='doing'?null:
                        <Row>
                            <img src={signIn.sign_in_method.get_QRcode_url} style={{ width: 'auto',height:'auto' }} width="42" height="42"/>
                        </Row>}
                        <Row>
                            已签到：{signIn.finished.join('、')}
                        </Row>
                        {signIn.sign_in_object.type=='custom'&&
                        <Row>
                            未签到：{signIn.unfinished.join('、')}
                        </Row>}
                    </Container>
                </Card.Body>
            </Card>
            }
        </div>
    )
}

export default SignInSystem