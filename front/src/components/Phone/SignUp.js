import { Container, Row,Figure,Image, Col,Card,Table,FloatingLabel,Button,Badge, Modal, Form, Accordion, ListGroup} from 'react-bootstrap';
import { RequireLogin } from '../Login';
import config from '../../config';
import { Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

function SignUp(){
    
    return(
        <RequireLogin
        notlogin={
            <Container>
                <Row className='my-5'>
                    <p>没有登录，请<a href={config['API']['AUTH_API']['login']}>登录</a></p>
                </Row>
            </Container>
        }
        logined={<SignUpRoute/>}
        />
    )
}

function SignUpRoute(){
    return(
        <Routes basePath='/'>
            <Route path='/' element={<SignUpHome/>}/>
            <Route path='/sign-up-hall' element={<SignUpShow/>}/>
            <Route path='/personal-sign-up' element={<SignUpShow/>}/>
        </Routes> 
    )
}
//签到的主页
function SignUpHome(){
    return(
        <div>
            <Row className='my-3  text-center'>
                <Link to={'/sign-up-hall'}>个人签到</Link>
            </Row>
            <Row className='my-3 text-center'>
                <Link to={'/personal-sign-up'}>签到大厅</Link>
            </Row>
            <Row className='my-3 text-center'>
                <Link>扫码</Link>
            </Row>
        </div>
    )
}

//签到展示
function SignUpShow({src}){
    const signUpMessages=useState([])
    // useEffect=(()=>{
    //     fetch(config['API']['SERVICE_API']['sign_in_system'][''])
    // },[])
    return(
        <ListGroup variant="" as="ul" >
            <ListGroup.Item action href="/link1">
                <div className="ms-2 me-auto">
                    <div className="fw-bold">Subheading</div>
                    Cras justo odio
                </div></ListGroup.Item>
            <ListGroup.Item action>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item action>Porta ac consectetur ac</ListGroup.Item>
        </ListGroup>
    )
}
//扫码
//单个签到
export default SignUp


