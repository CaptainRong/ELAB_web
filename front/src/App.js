import React,{useState} from 'react';
import {Routes,Route} from 'react-router-dom';
import { Container, Row, Col,Modal ,Button, Card} from 'react-bootstrap';


import Footer from './components/Base/Footer'
import Navbar from './components/Base/Nav'
import Sidebar from './components/Base/Sidebar'
import './app.css'


import PersonalCenter from './pages/PersonalCenter'
import MailCenter from './pages/MailCenter'
import ToDoList from './pages/ToDoList'
import OfficeHall from './pages/OfficeHall';
import About from './pages/About';

import { UserProvider, useUserContext } from './context/UserContext'
import { PopupProvider } from './context/PopupContext';
import Alert from 'react-bootstrap/Alert';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { SiteProvider } from './context/SiteContext';
import SignUp from './components/Phone/SignUp';

export default function App() {
  console.log(window.navigator.userAgent)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
  return (
    <>
      <Helmet>
        <title>ELAB</title>
      </Helmet>
      <div className="App">
        {/* 上下文 */}
        <SiteProvider>
        <UserProvider>
        <PopupProvider>
          {/* 内容 */}
          {isMobile?<PhoneApp/>:<PcApp/>}
        </PopupProvider>
        </UserProvider>
        </SiteProvider>
      </div>
    </>
  );
}


//登录提示
function LoginAlert(){
  const [show, setShow] = useState(true);
    const [UserManager,state]= useUserContext();

  useEffect(() => {
    setShow(true); // 设置 show 为 true，确保每次用户信息变化时都显示 Alert
  }, [state]);
  return(
    <div>
      {show? 
      <Alert variant="primary" onClose={() => setShow(false)} dismissible>
        <p>{state.loginMessage}</p>
      </Alert>:<></>}
    </div>
  )
}


//手机端
function PhoneApp(){
  return(
    <Container>
      <Row>
        <LoginAlert/>
      </Row>
      <Row className='my-4'>
       <h1>服务</h1> 
       <About/>
      </Row>
      <Row>
        <SignUp/>
      </Row>
    </Container>
    )
}
//pc端
function PcApp(){
  return (
    <Container fluid>
      <Row>
        <LoginAlert/>
        <Navbar/>
        <p></p>
      </Row>
      <Row className='my-4'>
        <Col className='col-2 mx-3'>
          <Sidebar/>
        </Col>
        <Col className='col-8 mx-5'>
          <Routes>
            <Route path='/office-hall/*' element={<OfficeHall/>} />
            <Route path='/to-do-list/*' element={<ToDoList/>} />
            <Route path='/mail/*' element={<MailCenter/>} />
            <Route path='/personal-center/*' element={<PersonalCenter/>} />
            <Route path='/about/*' element={<About/>} />
          </Routes>
        </Col>
      </Row>
      <Row className='my-5'/>
      <Row>
        <Footer />
      </Row>
    </Container>
  )
}