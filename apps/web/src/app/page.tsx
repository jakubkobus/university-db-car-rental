import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            shadcn/ui works!
          </p>
          <div className="flex flex-col gap-2">
            <Button>Button 1</Button>
            <Button variant="outline">Button 2</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}