

export default function Loading() {
    return (
        <section className="col-span-12 flex h-[100dvh] items-center justify-center ">
            <div className="flex flex-col items-center space-y-4">
                {/* Spinner */}
                <div className="relative h-32 w-32">
                    <div className="h-full w-full animate-spin rounded-full border-8 border-light border-t-primary"></div>
                </div>

                {/* Loading Message */}
                <p className="text-lg font-medium text-gray-600 font-heading">Loading, please wait...</p>
            </div>
        </section>
    );
}