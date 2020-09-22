import React, { useRef, useState, FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Card } from '../Login/style'
import api from '../../service/api'

// Components Prime
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from '../../global/globalStyle';

const CreateAccount: React.FC = () => {

	const toast = useRef<Toast>(null)
	const [name, setName] = useState<String>()
	const [email, setEmail] = useState<String>()
	const [password, setPassword] = useState<String>()

	const history = useHistory()

	function createUser(event: FormEvent): void{
		event.preventDefault()
		const body = { name: name, email: email, password: password }
		api.post('/user', body).then((doc) => {
			if(doc.status === 200){
				if(doc.data.driver === true && doc.data.name === 'MongoError'){
					toast.current?.show({ severity: 'warn', summary: 'Error', detail: 'E-mail already registered' })
				}
				else{
					history.push('/')
				}
			}
		}).catch(() => {
			toast.current?.show({ severity: 'warn', summary: 'Error', detail: 'Internal Error' })
		})
	}

	return (
		<Container>
			<Card>
				<Toast ref={toast}/>
				<form onSubmit={event => createUser(event)}>
					<InputText type="text" placeholder="Name" onChange={(e) => setName(e.currentTarget.value)} 
						style={{width: '100%'}} required/>
					<Divider height="10px"/>
					<InputText type="email" placeholder="Email" onChange={(e) => setEmail(e.currentTarget.value)} 
						style={{width: '100%'}} required/>
					<Divider height="10px"/>	
					<InputText type="password" placeholder="Password" onChange={(e) => setPassword(e.currentTarget.value)} 
						style={{width: '100%'}} required minLength={8}/>
					<Divider height="20px"/>
					<Button label="Create" type="submit" className="p-button-success" style={{width: '100%'}}/>
				</form>
			</Card>
		</Container>
	)
}

export default CreateAccount