import CreateTemplateForm from "@/components/create-template-form";

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}

export default function CreateTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  return <CreateTemplateForm templateId={params.id} />;
}