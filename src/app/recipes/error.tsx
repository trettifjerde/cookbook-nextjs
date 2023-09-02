'use client';
import EmptyComponent from '../../components/Empty';

export default function RecipeErrorPage() {
    return (
        <div className="fadeIn empty">
            <EmptyComponent message="An error has occurred" />
        </div>
    )
}