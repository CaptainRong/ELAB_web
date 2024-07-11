import React, { useEffect, useState } from 'react';
import { Container, Row,Figure,Image, Col,Card,Table,FloatingLabel,Button,Badge, Modal, Form, Accordion, ListGroup} from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { DataGrid,GridToolbar,zhCN,useGridApiRef } from '@mui/x-data-grid';
import config from '../../config';
import usePopupContext from '../../context/PopupContext';
import useConfrimDialog from '../../hook/useConfirmDialog';

import {DataGridPro} from '@mui/x-data-grid-pro';

import useModalShow from '../../hook/useModalShow';
import MaterialInfoForm from '../../form/MaterialInfoForm';
import { RequireLogin } from '../Login';


//出库
function MaterialCheckout({apiRef,setRefresh}){
    const {control,handleSubmit}=useForm()
    const popup=usePopupContext()

    function checkout(data){
        //检验数据是否合法
        if(data.number<=0){
            popup('数据不合法','错误')
        }
        const [id,_] = apiRef.current.getSelectedRows().entries().next().value;
        fetch(config['API']['SERVICE_API']['material_manage']['checkout_material']+`?material_id=${id}&number=${data.number}`,{
            method: 'GET',
			credentials: 'include',
        })
        .then(reponse=>reponse.json())
        .then(result=>{
            //成功后清空并关闭弹窗
            if (result.result=='ok'){
                setShow(false)
                popup('出库成功','成功')
                setRefresh(1)
            }else{
                console.log(result)
                popup(result.message,'出库失败')
            }
        })
        .catch(error=>{
            popup('网络错误','出库失败')
            console.error(error)
        })        
    }
    const [setShow,ShowModal]=useModalShow({
        title:'出库',
        body:
        <Form onSubmit={handleSubmit(checkout)}>
            <Form.Group >
                <Form.Label>出库数量：</Form.Label>
                <Controller
                name="number"
                control={control}
                render={({ field }) => 
                <Form.Control type='number' {...field} />}
                />  
            </Form.Group>
            <Button className='my-3' variant="primary" type="submit">提交</Button>
        </Form>
    })

    
    return(
        <div>
            {ShowModal}
            <Button onClick={()=>{
                if(apiRef.current.getSelectedRows().size==0){
                    popup('必须选择一个出库对象','错误')
                    return
                }
                setShow(true)
           }}>出库</Button>
        </div>
    )
}

//入库
function MaterialCheckin({apiRef,setRefresh}){
    const {control,handleSubmit}=useForm()
    const popup=usePopupContext()
    const [setShow,ShowModal]=useModalShow({
        title:'入库',
        body:
        <Form onSubmit={handleSubmit(checkin)}>
            <Form.Group >
                <Form.Label>入库数量：</Form.Label>
                <Controller
                name="number"
                control={control}
                render={({ field }) => 
                <Form.Control type='number' {...field} />}
                />  
            </Form.Group>
            <Button className='my-3' variant="primary" type="submit">提交</Button>
        </Form>
    })

    function checkin(data){
        //检验数据是否合法
        if(data.number<=0){
            popup('数据不合法','错误')
        }
        const [id,_] = apiRef.current.getSelectedRows().entries().next().value;
        fetch(config['API']['SERVICE_API']['material_manage']['checkin_material']+`?material_id=${id}&number=${data.number}`,{
            method: 'GET',
			credentials: 'include',
        })
        .then(reponse=>reponse.json())
        .then(result=>{
            //成功后清空并关闭弹窗
            if (result.result=='ok'){
                setShow(false)
                popup('入库成功','成功')
                setRefresh(1)
            }else{
                console.log(result)
                popup(result.message,'入库失败')
            }
        })
        .catch(error=>{
            popup('网络错误','入库失败')
            console.error(error)
        })        
    }
    return(
        <div>
            {ShowModal}
            <Button onClick={()=>{
                if(apiRef.current.getSelectedRows().size==0)
                    return popup('必须选择一个入库对象','错误')
                setShow(true)
           }}>入库</Button>
        </div>
    )
}

//添加物料
function AddMaterial({setRefresh}){
    const popup=usePopupContext()
    const { handleSubmit, control,reset} = useForm();
    function submitForm(data){
        //提交数据
        fetch(config['API']['SERVICE_API']['material_manage']['add_material'],{
            method: 'POST',
			credentials: 'include',
            body: JSON.stringify(data),
			headers:{
				'Content-Type': 'application/json'
			}
        })
        .then(reponse=>reponse.json())
        .then(result=>{
            //成功后清空并关闭弹窗
            if (result.result=='ok'){
                reset()
                setShow(false)
                popup('添加成功','成功')
                setRefresh(1)
            }else{
                popup(result.message,'添加失败')
            }
        })
        .catch(error=>{
            popup('网络错误','添加失败')
            console.error(error)
        })
    }
    const [setShow,ShowModal]=useModalShow({
            title:'添加物料',
            body:<MaterialInfoForm
                    handleSubmit={handleSubmit}
                    submitForm={submitForm}
                    control={control}
                />,
    })
    return(
        <div>
            <Button variant='danger' onClick={()=>{setShow(true)}}>添加</Button>
            {ShowModal}
        </div>)
}

//修改物料信息
function ModifyMaterial({apiRef,setRefresh}){
    const popup=usePopupContext()
    const { handleSubmit, control,reset,setValue} = useForm();
    var selectMaterialID=null
    function submitForm(data){
        //提交数据
        fetch(config['API']['SERVICE_API']['material_manage']['modify_material'],{
            method:'PUT',
            credentials: 'include',
            body: JSON.stringify(data),
			headers:{
				'Content-Type': 'application/json'
			}
        })
        .then(reponse=>reponse.json())
        .then(result=>{
            //成功后清空并关闭弹窗
            if (result.result=='ok'){
                reset()
                setShow(false)
                popup('修改成功','成功')
                setRefresh(1)
            }else{
                popup(result.message,'修改失败')
            }
        })
        .catch(error=>{
            popup('网络错误','修改失败')
            console.error(error)
        })

    }
    const [setShow,ShowModal]=useModalShow({
        title:'修改物料',
        body:<MaterialInfoForm
                handleSubmit={handleSubmit}
                submitForm={submitForm}
                control={control}
                />,
        props:{backdrop:"static",keyboard:false}
    })
    
    function ModifyOnclick(){
        if(apiRef.current.getSelectedRows().size==0)
            return popup('必须选择一个修改对象','错误')

        const [uniqueKey, selected] = apiRef.current.getSelectedRows().entries().next().value;
        setValue('name',selected.name)
        setValue('price',selected.price)
        setValue('number',selected.number)
        setValue('security_value',selected.security_value)
        setValue('source',selected.source)
        setValue('type',selected.type)
        setValue('remark',selected.remark)
        setValue('bar_code',selected.bar_code)
        setValue('position',selected.position)
        setValue('warehousing_date',selected.warehousing_date)
        setValue('state',selected.state)
        setValue('id',selected.id)
        setShow(true)
    }
    return(
        <div>
            <Button variant='danger' onClick={ModifyOnclick}>修改</Button>
            {ShowModal}
        </div>)
}


//查看物料日志
function MaterialLog(){
    const [materialLogs,setMaterialLogs]=useState([])
    const popup=usePopupContext()   
    const columns = [
        { field: 'id', headerName: 'ID'},
        { field: 'datetime', headerName: '时间',type:'date'},
        { field: 'operation', headerName: '操作'},
        { field: 'change', headerName: '改变'},
        { field: 'operator_name', headerName: '操作人'},
        { field: 'operator_id', headerName: '操作人id'},
        { field: 'operation_object_name', headerName: '操作对象'},
        { field: 'operation_object_id', headerName: '操作对象id'},
        { field: 'old_number', headerName: '旧值'},
        { field: 'new_number', headerName: '新值'},
    ];

    //获取日志信息
    function GetMaterailLogs(){
        fetch(config['API']['SERVICE_API']['material_manage']['get_materail_logs'],{
            method:'GET',
            credentials: 'include',
        })
        .then(response => response.json())
        .then(result => {
            if (result.result=='ok'){
                //转变时间
                if (result.data) 
                    var transformedData = result.data.map(item => ({
                        ...item,
                        datetime: new Date(item.datetime*1000)
                    }));
                setMaterialLogs(transformedData)
            }  
            else{
                popup(result.message,'获取日志信息失败')
            }
        })
        .catch(error => { 
            console.error('Error:', error);
            popup('网络错误','错误')
        })
    }
    const logTable=<DataGridPro
                    columns={columns}
                    rows={materialLogs}
                    loading={()=>{}}
                    localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
                    slots={{ toolbar: GridToolbar }}
                    />
    const [setShow,ShowModal]=useModalShow({title:'物料日志',body:logTable,props:{size:"lg"}})

    return(
        <div>               
            {ShowModal}             
            <Button variant='danger' onClick={()=>{
                GetMaterailLogs()
                setShow(true)
                }}>
                日志
            </Button>
        </div>
    )
    
}



function MaterialManagementSystemHome(){
    //表格api
    const apiRef = useGridApiRef();
    //所有的物料
    const [materials,setMaterials]=useState([])
    //消息弹窗
    const popup=usePopupContext()
    //确认弹窗
    const [setConfirmDialogShow,ConfirmDialog]=useConfrimDialog(
        {
            title:'确认',
            message:'是否确认要删除物料，删除后将无法撤销？',
            selected:DelectMaterialFetch,
        })
    
    //刷新数据的标志
    const [refreshFlag,setRefreshFlag]=useState(0)
    function setRefresh(data){
        setRefreshFlag(refreshFlag+data)
    }
    //表格的列定义
    const columns = [
    { field: 'id', headerName: 'ID'},
    { field: 'name', headerName: '名称'},
    { field: 'price', headerName: '价格'},
    { field: 'number', headerName: '数量'},
    { field: 'security_value', headerName: '安全值'},
    { field: 'source', headerName: '资产来源'},
    { field: 'type', headerName: '类型'},
    { field: 'bar_code', headerName: '条形码'},
    { field: 'position', headerName: '存放位置'},
    { field: 'remark', headerName: '备注',width: 200},
    { field: 'warehousing_date', headerName: '入库日期'},  
    { field: 'state', headerName: '状态'},
    ];

    //获取物料数据
    useEffect(()=>{
        fetch(config['API']['SERVICE_API']['material_manage']['get_materials'],{
            method:'GET',
			credentials: 'include',
        })
        .then(response => response.json())
		.then(result => {
            if (result.result=='ok'){
				setMaterials(result.data)
			}  
			else{
				popup(result.message,'获取物料信息失败')
			}
		})
		.catch(error => { 
			console.error('Error:', error);
			popup('网络错误','错误')
		})
    },[refreshFlag])
    //删除物料的请求
    function DelectMaterialFetch(select){
        if (!select)
            return 
        const [Key, selected] = apiRef.current.getSelectedRows().entries().next().value;
        //发送请求
        fetch(config['API']['SERVICE_API']['material_manage']['delete_material'],{
            method:'DELETE',
            credentials: 'include',
			headers:{
				'Content-Type': 'application/json'
			},
            body:JSON.stringify({id:selected.id})
        })
        .then(reponse=>reponse.json())
        .then(result=>{
            if (result.result=='ok'){
                popup('删除成功','成功')
                setRefresh(1)
            }else{
                popup(result.message,'删除失败')
            }
        })
        .catch(error=>{
            popup('网络错误','删除失败')
            console.error(error)
        })
    }
    
    function DelectMaterial(){
        //获取删除对象
        if(apiRef.current.getSelectedRows().size==0)
            return popup('必须选择一个删除对象','错误')
        //确认是否要删除
        setConfirmDialogShow(true)
    }
       
    return(
        <Card>
            <Card.Header><Card.Title className='text-center'>物料管理系统</Card.Title></Card.Header>
            <Card.Body>
                <Container>
                    {ConfirmDialog}
                    <Row style={{ height: 700, width: '100%' }}>
                    <DataGridPro
                        apiRef={apiRef}
                        columns={columns}
                        rows={materials}
                        loading={()=>{}}
                        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
                        slots={{ toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                        getRowHeight={() => 'auto'} 
                        getEstimatedRowHeight={() => 200} 
                        sx={{
                            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
                          }}
                        />
                    </Row>
                    <Row className='my-3'>
                        <Col className='col-2'><MaterialCheckout apiRef={apiRef} setRefresh={setRefresh}/></Col>
                        <Col className='col-2'><MaterialCheckin apiRef={apiRef} setRefresh={setRefresh}/></Col>
                    </Row> 
                    <Row className='my-3'>
                        <Col className='col-2'><AddMaterial setRefresh={setRefresh}/></Col>
                        <Col className='col-2'>
                            <ModifyMaterial 
                            apiRef={apiRef} 
                            popup={popup} 
                            setRefresh={setRefresh}/>
                        </Col>
                        <Col className='col-2'>
                            <Button variant='danger' onClick={DelectMaterial}>删除</Button>
                        </Col>
                        <Col className='col-2'>
                            <MaterialLog/>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}

function MaterialManagementSystem(){
    return(
        <RequireLogin
        notlogin={<p>请登陆</p>}
        logined={<MaterialManagementSystemHome/>}
        />
    )
  }


export default MaterialManagementSystem 
