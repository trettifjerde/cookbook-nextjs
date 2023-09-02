'use client';
import EmptyComponent from '../../components/Empty';

export default function RecipeErrorPage({error}: {error: Error}) {
    return (
        <div className="fadeIn empty">
            <EmptyComponent message={error.message} />
        </div>
    )
}