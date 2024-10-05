export default function AddStorePage() {
    return (
        <>
            <div className="font-normal text-indigo-600 text-3xl not-italic tracking-[-1.2px] my-8">
                Add Store
            </div>
            <div className="flex gap-2 my-4 flex-col">
                <p className="text-xl">Store Name</p>
                <input
                    className="flex justify-between items-center w-full rounded-3xl border-2 border-gray-300 p-4"
                    placeholder="Enter store name"
                />
            </div>
            <button className="bg-indigo-600 text-white rounded-3xl p-4 w-full">
                Add Store
            </button>
        </>
    );
}
