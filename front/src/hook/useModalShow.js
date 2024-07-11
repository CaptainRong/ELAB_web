import { Container, Row,Figure,Image, Col,Card,Table,FloatingLabel,Button,Badge, Modal, Form, Accordion, ListGroup} from 'react-bootstrap';
import { useState } from 'react';

function useModalShow(title='',header='',body='',footer='',props={}){
  const [show,setShow] =useState(false)
  const [contentValue,setContentValue]=useState({
    title:title,
    header:header,
    body:body,
    footer:footer,
    props:props
  })
  function setContent(dict){
    var newValue={...contentValue}
    for (var i in dict){
      newValue[i]=dict[i]
    }
    setContentValue(newValue)
  }
  const ShowModal=<ShowModalC 
                    props={contentValue.props}
                    show={show}
                    setShow={setShow}
                    title={contentValue.title}
                    header={contentValue.header}
                    body={contentValue.body}
                    footer={contentValue.footer}/>

  return [setShow,ShowModal,setContent]
}


function ShowModalC({show,setShow,title,header,body,footer,props}){
    return(
        <Modal show={show} onHide={()=>setShow(false)} {...props}>     
        <Modal.Header closeButton>
          <Modal.Title className='text-center'>{title}</Modal.Title>
          {header}
        </Modal.Header>

        <Modal.Body>{body}</Modal.Body>

        {footer!=''&&<Modal.Footer>{footer}</Modal.Footer>}
      </Modal>
    )
}

export default useModalShow






