class UserHelper {
	static isAuthenticated(): Boolean {
		const token = localStorage.getItem('token')
		if (token !== null) {
			console.log('VALIDOU')
			return true
		}
		console.log('REIOSSE')
		return false
	}
}

export default UserHelper	