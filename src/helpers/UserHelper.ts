class UserHelper {
	static isAuthenticated(): Boolean {
		const token = localStorage.getItem('token')
		if (token !== null) {
			return true
		}
		return false
	}
}

export default UserHelper