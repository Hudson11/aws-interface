import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Container, NavBar, Logo, Flex } from './style'
import { Button } from 'primereact/button';

const Nav: React.FC = () => {

	const history = useHistory()

	function logout(): void {
		localStorage.removeItem('token')
		history.replace('/')
	}

	return (
		<Container>
			<Logo >
				<img src="https://d1.awsstatic.com/icons/jp/console_s3_icon.64795d08c5e23e92c12fe08c2dd5bd99255af047.png" alt="logo" />
				<strong> AWS S3 Cliente </strong>
			</Logo>
			<NavBar>
				<ul>
					<li>	
						<Flex>
							<Link to="/rekognition"> Rekognition </Link>
							<label>Logout</label>
							<Button icon="pi pi-arrow-right" className="p-button-rounded p-button-secondary" 
								onClick={() => logout()}/>
						</Flex>
					</li>
				</ul>
			</NavBar>
		</Container>
	)
}

export default Nav