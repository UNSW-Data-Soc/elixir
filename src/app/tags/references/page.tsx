import TagReferencesList from "./tagReferencesList";

export default function Tags() {
    return (
        <>
            <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
                <TagReferencesList styleLarge={true} showEditingTools={true}/>
            </div>
        </>
    );
}
