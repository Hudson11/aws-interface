import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import Nav from '../../components/Nav';
import api from '../../service/api';
import { Footer } from './style';

// components prime
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';

interface BucketInterface {
	Name: string
	CreationDate: string
}

const Home: React.FC = () => {

	const [buckets, setBuckets] = useState<BucketInterface[]>([])
	const [openDialog, setOpenDialog] = useState(false)
	const [bucketName, setBucketName] = useState<String>()
	const toast = useRef<Toast>(null)
	const [load, setLoad] = useState(false)
	const history = useHistory()

	// Responsável por carregar os buckets na inicialização
	useEffect(() => {
		getBuckets()
	}, [])

	function getBuckets(): void {
		const token = `Bearer ${localStorage.getItem('token')}`
		setLoad(true)
		api.get('/s3', { headers: { Authorization: token } }).then((doc) => {
			setBuckets(doc.data.Buckets)
			setLoad(false)
		}).catch(() => {
			toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Internal Error' })
			setLoad(false)
		})
	}

	function deleteBucket(name: string): void {
		const token = `Bearer ${localStorage.getItem('token')}`
		api.delete(`/s3/${name}`, { headers: { Authorization: token } }).then((doc) => {
			if (doc.status === 200) {
				toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Bucket Deleted' })
				setBuckets(buckets?.filter((bucket) => bucket.Name !== name))
			}
		}).catch(() => {
			toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Internal Error' })
		})
	}

	function createBucket(event: FormEvent): void {
		event.preventDefault()
		const token = `Bearer ${localStorage.getItem('token')}`
		const body = { name: bucketName }
		api.post('/s3', body, { headers: { Authorization: token } }).then((data) => {
			if (data.status === 200) {
				getBuckets()
				setOpenDialog(false)
				toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Success create Bucket' })
			}
		}).catch(() => {
			toast.current?.show({ severity: 'warn', summary: 'Warn', detail: 'Internal Error' })
		})
	}

	function pushBucket(name: string): void {
		history.push(`/bucket/${name}`)
	}

	// buttons options DATATABLE
	function body(data: BucketInterface): JSX.Element {
		return (
			<>
				<Button icon="pi pi-times" className="p-button-rounded p-button-danger"
					onClick={() => deleteBucket(data.Name)} />
				<Button icon="pi pi-angle-right" className="p-button-rounded p-button-info" style={{ marginLeft: '20px' }}
					onClick={() => pushBucket(data.Name)} />
			</>
		);
	}

	return (
		<>
			<Nav />
			<Toast ref={toast} />
			{ buckets?.length > 0 ? 
				<DataTable value={buckets} paginator rows={10}>
					<Column field="Name" header="Name"></Column>
					<Column field="CreationDate" header="Creation Date"></Column>
					<Column body={body}></Column>
				</DataTable>
				: load ? <div> <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar> </div> : <></>
			}
			{ /** MODAL ADD BUCKET */}
			<Dialog header="Create Bucket" visible={openDialog} style={{ width: '50vw' }} onHide={() => setOpenDialog(false)}>
				<form onSubmit={event => createBucket(event)}>
					<InputText id="namebucket" onChange={event => setBucketName(event.currentTarget.value)} required
						style={{ width: '100%' }} />
					<Footer>
						<Button label="Create" type="submit" style={{ marginTop: '20px' }} />
					</Footer>
				</form>
			</Dialog>
			{ /* FLOATING BUTTON  */}
			<Button icon="pi pi-plus" className="p-button-rounded p-button-info"
				style={{ position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px' }}
				onClick={() => setOpenDialog(true)} />
		</>
	)
}

export default Home