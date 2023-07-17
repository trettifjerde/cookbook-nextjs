import SignForm from '@/components/auth/signForm';
import { notFound } from 'next/navigation';

export default function AuthPage({params}: {params: {auth: string}}) {
    if (params.auth === 'login' || params.auth === 'signup')
        return <SignForm mode={params.auth} />
    else {
        notFound();
    }
}

export async function generateStaticParams() {
    return [{auth: 'login'}, {auth: 'signup'}];
}