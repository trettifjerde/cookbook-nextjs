import SignForm from '@/components/auth/sign-form';

export default function AuthPage({params}: {params: {mode: string }}) {

    const {mode} = params;
    return <SignForm isSignUpMode={mode === 'signup'} />
}

export function generateStaticParams() {
    return [{mode: 'login'}, {mode: 'signup'}]
}