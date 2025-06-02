


export default async function authenticateUser(email:string, password:string) {
    try {
        console.log("authenticate user hit!")

        const isAuthenticated = await fetch('', {
            method: 'POST', // or 'GET' if appropriate
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })


        return isAuthenticated;
    } catch (error) {
        return error
    }
}