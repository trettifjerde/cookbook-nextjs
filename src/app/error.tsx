'use client';

import { Fragment } from 'react';
import EmptyComponent from '../components/ui/Empty';

export default function ErrorPage({error}: {error: Error}) {
    let title = 'An error has occurred';
    let message = 'Something went wrong';
    
    return (
        <Fragment>
            <h3 className='c'>{title}</h3>
            <EmptyComponent message={error.message || message} />
        </Fragment>
    )
}