import SignForm from '@/components/auth/sign-form';

export default function AuthPage({params}: {params: {mode: string}}) {
    const isSignUpMode = params.mode === 'signup';
    return <SignForm isSignUpMode={isSignUpMode} />
}

export async function generateStaticParams() {
    return [{mode: 'login'}, {mode: 'signup'}];
}