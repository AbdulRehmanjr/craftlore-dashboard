import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const CardLoader = () => {
    return (
        <Card className="w-full">
            <CardHeader className="text-primary">
                <CardTitle>
                    <Skeleton className="h-4 w-28" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-36" />
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Skeleton className="h-4 w-20" />
            </CardFooter>
        </Card>
    );
};
