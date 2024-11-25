
export const SimpleLoader = () => (
    <div className="flex items-center justify-center  w-full">
        <div className="space-y-6 text-center">
            <div className="relative mx-auto h-20 w-20">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-light" />
                <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-primary" />
            </div>
        </div>
    </div>
);
