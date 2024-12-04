import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PriceSectionForm } from "~/components/cost/section/add-section";
import { PriceSectionList } from "~/components/cost/section/section-list";

type SectionFormProps = {
  subId: string;
};

export const CostSectionForm = ({ subId }: SectionFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section and value creations</CardTitle>
        <CardDescription>
          Through this form we can create sections and there values for
          different material through this image.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <PriceSectionForm subId={subId}/>
        <PriceSectionList subId={subId} />
      </CardContent>
    </Card>
  );
};
