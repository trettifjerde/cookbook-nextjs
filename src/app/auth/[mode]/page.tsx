import SignForm from '@/components/auth/sign-form';
import getUserId from '@/helpers/server/cachers/token';
import { redirect } from 'next/navigation';

export default function AuthPage({params}: {params: {mode: string }}) {
    const isAuthed = getUserId();
    if (isAuthed)
        redirect('/recipes');
    
    const {mode} = params;
    return <SignForm isSignUpMode={mode === 'signup'} />
}

export function generateStaticParams() {
    return [{mode: 'login'}, {mode: 'signup'}]
}