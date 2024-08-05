import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { cache } from 'react';

function verifyToken() {
    const token = cookies().get('token')?.value || '';
    let id: string | null = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_PRIVATE!) as {id: string};
            id = decoded.id;
        }
        catch (error) {
            console.log('Token verification error');
        }
    }

    //console.log('verifying token', 'Authed:', !!token);

    return id;
}

const getUserId = cache(verifyToken);

export default getUserId;