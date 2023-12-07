'use client';
import EmptyComponent from '../../components/ui/Empty';

export default function RecipeErrorPage() {
    return (
        <div className="fadeUp empty">
            <EmptyComponent message="An error has occurred" />
        </div>
    )
}