import EmptyComponent from "@/components/Empty";

export default function NotFound() {
    return <div className="fadeIn empty">
        <EmptyComponent message="Recipe not found" />
    </div>
}