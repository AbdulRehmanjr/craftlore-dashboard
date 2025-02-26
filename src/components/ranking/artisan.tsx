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

export const RankArtisanTable = async () =>{
  const data = await api.rank.getArtisansByRank();

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
              <TableHead>Full Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Skill Level</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.gold && data.gold.length > 0 ? (
              data.gold.map((artisan) => (
                <TableRow key={artisan.artisanId}>
                  <TableCell className="font-medium">{artisan.user.fullName}</TableCell>
                  <TableCell>{artisan.craftSpecialty}</TableCell>
                  <TableCell>{artisan.craftSkill}</TableCell>
                  <TableCell>{artisan.craftExperience} years</TableCell>
                  <TableCell>
                    <Badge
                      variant={artisan.status === "active" ? "default" : "destructive"}
                    >
                      {artisan.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No Gold ranked artisans found
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
              <TableHead>Full Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Skill Level</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.silver && data.silver.length > 0 ? (
              data.silver.map((artisan) => (
                <TableRow key={artisan.artisanId}>
                  <TableCell className="font-medium">{artisan.user.fullName}</TableCell>
                  <TableCell>{artisan.craftSpecialty}</TableCell>
                  <TableCell>{artisan.craftSkill}</TableCell>
                  <TableCell>{artisan.craftExperience} years</TableCell>
                  <TableCell>
                    <Badge
                      variant={artisan.status === "active" ? "default" : "destructive"}
                    >
                      {artisan.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No Silver ranked artisans found
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
              <TableHead>Full Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Skill Level</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.bronze && data.bronze.length > 0 ? (
              data.bronze.map((artisan) => (
                <TableRow key={artisan.artisanId}>
                  <TableCell className="font-medium">{artisan.user.fullName}</TableCell>
                  <TableCell>{artisan.craftSpecialty}</TableCell>
                  <TableCell>{artisan.craftSkill}</TableCell>
                  <TableCell>{artisan.craftExperience} years</TableCell>
                  <TableCell>
                    <Badge
                      variant={artisan.status === "active" ? "default" : "destructive"}
                    >
                      {artisan.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No Bronze ranked artisans found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}