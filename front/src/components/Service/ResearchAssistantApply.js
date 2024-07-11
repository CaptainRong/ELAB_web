import { Container, Row,Figure, Col,Card,Table,FloatingLabel,Button,Badge, Modal, Form, Accordion, ListGroup} from 'react-bootstrap';
import { RequireLogin } from '../Login';
import SimpleApply from './SimpleApply';


function ResearchAssistantApplyHome({applyFileURL}){
    return (
        <SimpleApply 
        title={'科研助手申请'}
        body={'这里放正文'}
        accept={['.docx','doc']}
        applyFileURL={applyFileURL}
        applyFileName={'科研助手申请文件.docx'}
        />
    )
}


function ResearchAssistantApply(){
    return(
        <RequireLogin
        notlogin={<p>请登陆</p>}
        logined={<ResearchAssistantApplyHome applyFileURL={"/path/to/download/file"}/>}
        />
    )
}

export default ResearchAssistantApply