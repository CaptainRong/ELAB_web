import { ListGroup,Container,Tooltip,OverlayTrigger, Accordion, Row, Col,Card,Table,FloatingLabel,Button,Badge, Modal, Form} from 'react-bootstrap';
import useSiteContext from '../context/SiteContext'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import {QrReader} from 'react-qr-reader';

function QRScanne(){
  const [result, setResult] = useState('');

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  }

  const handleError = (err) => {
    console.error(err);
  }

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>{result}</p>
    </div>
  );
}

function About1(){
  return (
    <Card>
      <Card.Body>
        <Container>
          <Row className='my-4'>1.
            <Link  style={{ textDecoration: 'none' }}>
              <strong>签到记录</strong>
            </Link>
          </Row>
          <Row className='my-4'>2.
            <Button style={{ width: 'auto',height:'auto' }}  variant="outline-primary" type="submit"><strong >发起签到</strong></Button><br/>
            <Button style={{ width: 'auto',height:'auto' }}  variant="outline-dark" type="submit"><strong >发起签到</strong></Button><br/>
            <Button style={{ width: 'auto',height:'auto' }}  variant="outline-secondary" type="submit"><strong >发起签到</strong></Button><br/>
            <Button style={{ width: 'auto',height:'auto' }}  variant="outline-danger" type="submit"><strong >发起签到</strong></Button><br/>
          </Row>
          <Row className='my-4'>3.
            <Button style={{ width: 'auto',height:'auto' }} variant='light'><strong>按钮</strong></Button>
          </Row>
          <Row className='my-4'>4.
            <Button style={{ width: 'auto',height:'auto' }} variant='primary'><strong>按钮</strong></Button>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}
function About(){
  return(
    <QRScanne/>
  )
}
export default About;
