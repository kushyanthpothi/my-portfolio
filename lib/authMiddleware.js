import { auth } from '@/lib/admin';

export async function verifyAuth(req) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { error: 'Unauthorized: Missing or invalid token', status: 401 };
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        
        return { user: decodedToken };
    } catch (error) {
        console.error('Authentication Error:', error);
        return { error: 'Unauthorized: Invalid token', status: 401 };
    }
}
