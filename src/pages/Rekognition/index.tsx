import React, { useRef, useState, useEffect } from 'react'
import Nav from '../../components/Nav';
import api from '../../service/api'

// components prime
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { BucketObject } from '../Bucket';

const h2Style = {
	marginLeft: '10px'
}

const Rekognition: React.FC = () => {

	// id bucket params
	const id = 'serverless-rekognition-person'
	const toast = useRef<Toast>(null)
	const [objects, setObjects] = useState<BucketObject[]>([])
	const [faces, setFaces] = useState<BucketObject[]>([])
	const [openDialog, setOpenDialog] = useState(false)
	const [aguarde, setAguarde] = useState(false)
	const [load, setLoad] = useState(false)

	// carrega todos os objects do bucket na inicializaçaõ
	useEffect(() => {
		getObjects()
	}, [ id ])

	function getObjects(): void{
		const token = `Bearer ${localStorage.getItem('token')}`
		setLoad(true)
		api.get(`/s3/${id}/objects`, { headers: { Authorization: token } }).then((doc) => {
			const list = doc.data.Contents
			var face = list.filter((value: { Key: string | string[]; }) => value.Key.includes('faces/'))
			face = face.filter((value: { Key: string; }) => value.Key !== 'faces/')
			const arqs = list.filter((value: { Key: string | string[]; }) => !value.Key.includes('faces/'))
			setFaces(face)
			setObjects(arqs)
			setLoad(false)
		}).catch(() => {
			setLoad(false)
			toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Internal Error' })
		})
	}

	function removeObject(key: string): void{
		const token = `Bearer ${localStorage.getItem('token')}`
		api.delete(`/s3/${id}/${key}`, { headers: { Authorization: token } }).then((doc) => {
			if(doc.status === 200){
				setObjects(objects?.filter((value) => value.Key !== key))
				toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Object Deleted' })
			}
		}).catch(() => {
			toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Internal Error' })
		})
	}

	function removeObjectRoot(key: string): void{
		const token = `Bearer ${localStorage.getItem('token')}`
		api.delete(`/s3/${id}/root/object?key=${key}`, { headers: { Authorization: token } }).then((doc) => {
			if(doc.status === 200){
				setFaces(faces?.filter((value) => value.Key !== key))
				toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Object Deleted' })
			}
		}).catch(() => {
			toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Internal Error' })
		})
	}

	function download(url: string, key: string): void{
		const link = document.createElement('a')
		link.setAttribute('href', url)
		link.setAttribute('download', key)
		document.body.appendChild(link)
		link.click()
	}

	function getObject(key: string): void{
		const token = `Bearer ${localStorage.getItem('token')}`
		api.get(`/s3/${id}/${key}`, { headers: { Authorization: token } }).then((doc) => {
			if(doc.status === 200){
				download(doc.data.url, key)
			}
		}).catch(() => {
			toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Internal Error' })
		})
	}

	function getObjectRoot(key: string): void{
		const token = `Bearer ${localStorage.getItem('token')}`
		api.get(`/s3/${id}/root/object/?key=${key}`, { headers: { Authorization: token } }).then((doc) => {
			if(doc.status === 200){
				download(doc.data.url, key)
			}
		}).catch(() => {
			toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Internal Error' })
		})
	}

	function body(object: BucketObject): JSX.Element {
		return (
			<>
				<Button icon="pi pi-times-circle" className="p-button-rounded p-button-danger"
					onClick={() => removeObject(object.Key)}/>
				<Button icon="pi pi-cloud-download" className="p-button-rounded p-button-info" 
					onClick={() => getObject(object.Key)} style={{ marginLeft: '20px' }}/>
			</>
		);
	}

	function bodyFaces(object: BucketObject): JSX.Element {
		return (
			<>
				<Button icon="pi pi-times-circle" className="p-button-rounded p-button-danger"
					onClick={() => removeObjectRoot(object.Key)}/>
				<Button icon="pi pi-cloud-download" className="p-button-rounded p-button-info" 
					onClick={() => getObjectRoot(object.Key)} style={{ marginLeft: '20px' }}/>
			</>
		);
	}

	function footerDialog(): JSX.Element{
		return <p> Drag and drop files to here to upload. </p>
	}

	async function onUpload(data: any[]) {
		const token = `Bearer ${localStorage.getItem('token')}`
		setAguarde(true)
		for (let index = 0; index < data.length; index++) {
			const formData = new FormData();
			formData.append('file', data[index]);
			const promise = await api.post(`/s3/${id}/upload`, formData, {
				headers: {
					Authorization: token,
					"Content-Type": 'multipart/form-data'
				}
			});
			if(promise.status !== 200){
				toast.current?.show({severity: 'warn', summary: 'Error', detail: 'Upload Error'});
				break;
			}
		}
		getObjects()
		setAguarde(false)
		setOpenDialog(false)
		toast.current?.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
	}

	return (
		<>
			<Nav />
			<Toast ref={toast} />
			{ /** IMAGES UPLOAD  */ }
			{ objects?.length > 0 ?
				<>
					<h2 style={h2Style}> Images </h2> 
					<DataTable value={objects} paginator rows={5}>
						<Column field="Key" header="Key"></Column>
						<Column field="Size" header="Size"></Column>
						<Column field="LastModified" header="Last Modified"></Column>
						<Column field="Owner.DisplayName" header="Username"></Column>
						<Column body={body}></Column>
					</DataTable>
				</>
				: load ? <div> <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar> </div> : <></>
			}
			{ /** IMAGES UPLOAD  */ }
			{ faces?.length > 0 ?
				<>
					<h2 style={h2Style}> Detected Faces </h2> 
					<DataTable value={faces} paginator rows={5}>
						<Column field="Key" header="Key"></Column>
						<Column field="Size" header="Size"></Column>
						<Column field="LastModified" header="Last Modified"></Column>
						<Column field="Owner.DisplayName" header="Username"></Column>
						<Column body={bodyFaces}></Column>
					</DataTable>
				</>
				: load ? <div> <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar> </div> : <></>
			}
			{ /** DIALOG UPLOADFILE */ }
			<Dialog header="Upload File" visible={openDialog} onHide={() => setOpenDialog(false)}
				style={{ width: '50vw' }} >
				{ aguarde 
					? <>
							<h2> Wait </h2>
							<ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
						</> 
					: <FileUpload name="demo[]" url="/upload" customUpload uploadHandler={files => onUpload(files.files)}  accept="image/*" 
							maxFileSize={1000000} emptyTemplate={footerDialog} multiple/> 
				}
			</Dialog>
			{ /**OPEN DIALOG */ }
			<Button icon="pi pi-cloud-upload" className="p-button-rounded p-button-info" 
				style={{position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px'}}
				onClick={() => setOpenDialog(true)}/>
		</>
	);
}

export default Rekognition