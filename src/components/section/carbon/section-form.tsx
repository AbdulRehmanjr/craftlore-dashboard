import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CarbonSectionForm } from "~/components/section/carbon/add-section";
import { CarbonSectionList } from "~/components/section/carbon/section-list";


type SectionFormProps = {
  subId: string;
};

export const SectionForm = ({ subId }: SectionFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section and value creations</CardTitle>
        <CardDescription>
          Through this form we can create sections and there values for
          different material here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <CarbonSectionForm subId={subId}/>
        <CarbonSectionList subId={subId} />
      </CardContent>
    </Card>
  );
};
