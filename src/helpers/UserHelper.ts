class UserHelper {
	static isAuthenticated(): Boolean {
		const token = localStorage.getItem('token')
		if (!token) {
			return false
		}
		return true
	}
}

export default UserHelper	