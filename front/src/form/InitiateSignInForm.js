import { useForm ,Controller} from 'react-hook-form';
import { Container, Row, Col,Card,Table,FloatingLabel,Button,Badge, Modal, Form} from 'react-bootstrap';
import { useState } from 'react';
import { set } from 'lodash';

function InitiateSignInForm({submitForm,customSignInObject,control,setSignInObject,setValue}){

    return(
        <Form className="mx-auto" style={{maxWidth:"700px"}} onSubmit={submitForm}>
        <Container >
            <Row className='my-4'>
                <Controller
                    name='title'
                    control={control}
                    render={({field})=>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">标题：</Form.Label>
                        <Col><Form.Control required {...field} /></Col>
                    </Form.Group>}
                    />
            </Row>
            <Row className='my-4'>
                <Col className='col-6'>
                    <Controller
                        name='start_time'
                        control={control}
                        render={({field})=>
                        <Form.Group as={Row}>
                            <Form.Label sm="4" column>开始时间：</Form.Label>
                            <Col><Form.Control required style={{maxWidth:"185px"}} type="time" {...field} /></Col>
                        </Form.Group>}   
                        />
                </Col>
                <Col className='col-6'>
                    <Controller
                        name='end_time'
                        control={control}
                        render={({field})=>
                        <Form.Group as={Row}>
                            <Form.Label sm="4" column >结束时间：</Form.Label>
                            <Col><Form.Control required style={{maxWidth:"185px"}} type="time" {...field} /></Col>
                        </Form.Group>}   
                        />
                </Col>
            </Row>
            <Row className='my-4'>
                <Controller
                    name='sign_in_method'
                    control={control}
                    render={({field})=>
                    <Form.Group as={Row}>
                            <Form.Label column sm="2">签到方式：</Form.Label>
                            <Col>
                                <Form.Select {...field}  style={{maxWidth:"150px"}}>
                                    <option value="common">普通签到</option>
                                    <option value="QRcode">扫码签到</option>
                                </Form.Select>
                            </Col>
                    </Form.Group>}
                    />
            </Row>
            <Row>
                <Controller
                    name='sign_in_object'
                    control={control}
                    render={({field})=>
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">签到对象：</Form.Label>
                        <Col>
                            <Form.Select
                                {...field}  
                                style={{maxWidth:"150px"}}
                                onChange={(event)=>{setSignInObject(event.target.value)
                                        setValue('sign_in_object',event.target.value)}}>
                                <option value="hall">签到大厅</option>
                                <option value="custom">自定义</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>}
                    />
            </Row>
            {customSignInObject}
            <Row className='my-4'>
                <Controller
                    name='sign_in_result'
                    control={control}
                    render={({field})=>
                    <Form.Group as={Row}>
                            <Form.Label column sm="2">结果导入：</Form.Label>
                            <Col>
                                <Form.Select {...field}  style={{maxWidth:"150px"}}>
                                    <option value="no">无</option>
                                    <option value="extend_ppt">扩展ppt</option>
                                </Form.Select>
                            </Col>
                    </Form.Group>}
                    />
            </Row>
            <Row>
                <Col className='col-7'/>
                <Col className='col-5'>
                    <Button className='my-4' variant="outline-primary" type="submit"><strong>确认</strong></Button>
                </Col>
            </Row>
        </Container>
        </Form>
    )
}

export default InitiateSignInForm


