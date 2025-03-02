
import { api } from "~/trpc/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

export const RankBusinessTable = async ()=> {
  const data= await api.rank.getBusinessesByRank();

  return (
    <div className="space-y-6">
      {/* Gold Rank */}
      <div className="rounded-lg border bg-yellow-50 p-4">
        <h2 className="mb-4 flex items-center text-xl font-bold text-yellow-700">
          <span className="mr-2 text-2xl">🏆</span> Gold Rank
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Years of Operation</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.gold && data.gold.length > 0 ? (
              data.gold.map((business) => (
                <TableRow key={business.businessId}>
                  <TableCell className="font-medium">{business.businessName}</TableCell>
                  <TableCell>{business.businessType}</TableCell>
                  <TableCell>{business.businessMarket}</TableCell>
                  <TableCell>{business.yearOfOperation}</TableCell>
                  <TableCell>
                    <Badge
                      variant={business.status === "active" ? "default" : "destructive"}
                    >
                      {business.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No Gold ranked businesses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Silver Rank */}
      <div className="rounded-lg border bg-slate-50 p-4">
        <h2 className="mb-4 flex items-center text-xl font-bold text-slate-700">
          <span className="mr-2 text-2xl">🥈</span> Silver Rank
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Years of Operation</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.silver && data.silver.length > 0 ? (
              data.silver.map((business) => (
                <TableRow key={business.businessId}>
                  <TableCell className="font-medium">{business.businessName}</TableCell>
                  <TableCell>{business.businessType}</TableCell>
                  <TableCell>{business.businessMarket}</TableCell>
                  <TableCell>{business.yearOfOperation}</TableCell>
                  <TableCell>
                    <Badge
                      variant={business.status === "active" ? "default" : "destructive"}
                    >
                      {business.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No Silver ranked businesses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bronze Rank */}
      <div className="rounded-lg border bg-amber-50 p-4">
        <h2 className="mb-4 flex items-center text-xl font-bold text-amber-700">
          <span className="mr-2 text-2xl">🥉</span> Bronze Rank
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Years of Operation</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.bronze && data.bronze.length > 0 ? (
              data.bronze.map((business) => (
                <TableRow key={business.businessId}>
                  <TableCell className="font-medium">{business.businessName}</TableCell>
                  <TableCell>{business.businessType}</TableCell>
                  <TableCell>{business.businessMarket}</TableCell>
                  <TableCell>{business.yearOfOperation}</TableCell>
                  <TableCell>
                    <Badge
                      variant={business.status === "active" ? "default" : "destructive"}
                    >
                      {business.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No Bronze ranked businesses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

