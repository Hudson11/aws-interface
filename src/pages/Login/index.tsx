import React, { useState, FormEvent, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Card } from './style'
import { Divider } from '../../global/globalStyle'
import api from '../../service/api'

// Components Prime
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const Login: React.FC = () => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const toast = useRef<Toast>(null)
	const history = useHistory()

	async function login(event: FormEvent): Promise<void> {
		event.preventDefault()
		const body = { email, password }
		const promise = await api.post('/auth', body)
		if (promise.status === 200) {
			if (promise.data.status === false && promise.data.message === 'Unauthorized') {
				toast.current?.show({ severity: 'info', summary: promise.data.message, detail: 'Do you really have an account?' })
			} else if (promise.data.status === false && promise.data.message === 'Password error') {
				toast.current?.show({ severity: 'info', summary: 'Unauthorized', detail: promise.data.message })
			}
			else {
				localStorage.setItem('token', promise.data.token)
				history.push('/home')
			}
		}
		else {
			toast.current?.show({ severity: 'error', summary: 'Server Error', detail: '' })
		}
	}

	function pushCreateAccount(): void{
		history.push('/createaccount')
	}

	return (
		<Container>
			<Card>
				<Toast ref={toast} />
				<form onSubmit={event => login(event)}>
					<InputText placeholder="Email" type="email" required onChange={event => setEmail(event.currentTarget.value)} 
						style={{width: '100%'}}/>
					<Divider height="10px" />
					<InputText placeholder="Password" type="password" required onChange={event => setPassword(event.currentTarget.value)} 
						style={{width: '100%'}}/>
					<Divider height="20px" />
					<Button label="Login" type="submit" style={{width: '100%'}}/>
				</form>
				<Divider height="10px" />
				<Button label="Create Account" type="button" className="p-button-info" style={{width: '100%'}}
					onClick={() => pushCreateAccount()}/>
			</Card>
		</Container>
	);
}

export default Login