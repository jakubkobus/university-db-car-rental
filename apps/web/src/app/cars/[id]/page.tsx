import { Car, FuelType, MileageUnit, Transmission } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewsSection } from "@/components/reviews-section";

const fuelTypeMap: Record<FuelType, string> = {
  [FuelType.PETROL]: "Benzyna",
  [FuelType.DIESEL]: "Diesel",
  [FuelType.ELECTRIC]: "Elektryczny",
  [FuelType.HYBRID]: "Hybryda",
};

const transmissionMap: Record<Transmission, string> = {
  [Transmission.MANUAL]: "Manualna",
  [Transmission.AUTOMATIC]: "Automatyczna",
};

const mileageUnitMap: Record<MileageUnit, string> = {
  [MileageUnit.KILOMETER]: "km",
  [MileageUnit.MILE]: "mi",
};

async function getCar(id: string): Promise<Car | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

async function getReviews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    return {
      title: "Samochód nie znaleziony",
    };
  }

  return {
    title: `${car.brand} ${car.model} - Wypożyczalnia samochodów`,
    description: car.description || `Wypożycz ${car.brand} ${car.model} za ${car.pricePerDay} PLN/dzień`,
  };
}



export default async function CarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCar(id);
  const allReviews = await getReviews();

  if (!car) {
    notFound();
  }

  const carReviews = allReviews.filter((review: any) => review.carId === parseInt(id));
  const avgRating = carReviews.length > 0
    ? carReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / carReviews.length
    : 0;

  const specs = [
    { label: "Paliwo", value: fuelTypeMap[car.fuelType] },
    { label: "Skrzynia biegów", value: transmissionMap[car.transmission] },
    { label: "Przebieg", value: `${car.mileage} ${mileageUnitMap[car.mileageUnit]}` },
    ...(car.engineSize ? [{ label: "Pojemność silnika", value: `${car.engineSize} cm³` }] : []),
    ...(car.horsePower ? [{ label: "Moc", value: `${car.horsePower} KM` }] : []),
    { label: "Kolor", value: car.color || "Nieznany" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/" className="hover:text-primary transition-colors">Samochody</Link>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-foreground font-medium">{car.brand} {car.model}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
                {car.imageUrl ? (
                  <Image
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Brak zdjęcia
                  </div>
                )}
              </div>

              {/* Car Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-4xl">{car.brand} {car.model}</CardTitle>
                      <CardDescription className="text-base">
                        {car.category?.name || "Samochód osobowy"} • {car.year}
                      </CardDescription>
                    </div>
                    {!car.isAvailable && (
                      <Badge variant="destructive" className="h-fit">
                        Niedostępny
                      </Badge>
                    )}
                  </div>
                  {car.description && (
                    <>
                      <Separator className="my-4" />
                      <p className="text-muted-foreground leading-relaxed">
                        {car.description}
                      </p>
                    </>
                  )}
                </CardHeader>
              </Card>

              {/* Tabs for Specs and Features */}
              <Tabs defaultValue="specs" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="specs">Specyfikacja</TabsTrigger>
                  <TabsTrigger value="features">
                    Wyposażenie {car.features && car.features.length > 0 && `(${car.features.length})`}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Specyfikacja techniczna</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {specs.map((spec, index) => (
                          <div key={index}>
                            <p className="text-sm text-muted-foreground mb-2">{spec.label}</p>
                            <p className="font-semibold text-foreground">{spec.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {car.maintenance && car.maintenance.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Historia przeglądów</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {car.maintenance.map((service: any) => (
                            <div key={service.id} className="flex items-start justify-between pb-3 last:pb-0 border-b last:border-0">
                              <div>
                                <p className="font-semibold text-sm">{service.type}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(service.date).toLocaleDateString('pl-PL')}
                                </p>
                              </div>
                              <Badge variant="outline">{service.cost} PLN</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  {car.features && car.features.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Dostępne wyposażenie</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {car.features.map((feature) => (
                            <div key={feature.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-100">
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                              <span className="text-sm">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        Brak informacji o wyposażeniu
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

               {/* Reviews Section */}
               <ReviewsSection carReviews={carReviews} avgRating={avgRating} carId={parseInt(id)} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Pricing Card */}
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Cena wynajmu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-4xl font-bold text-primary">{car.pricePerDay}</p>
                      <p className="text-sm text-muted-foreground">PLN / dzień</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Wymagana kaucja</p>
                      <p className="text-2xl font-semibold">{car.deposit} PLN</p>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      disabled={!car.isAvailable}
                      asChild
                    >
                      <Link href={`/rentals/new?carId=${car.id}`}>
                        {car.isAvailable ? "Rezerwuj teraz" : "Niedostępny"}
                      </Link>
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/">
                        Powrót do listy
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Car Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Informacje</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Nr rejestracji</p>
                      <p className="font-semibold">{car.plateNumber}</p>
                    </div>
                    {car.isAvailable && (
                      <Badge variant="default" className="w-fit">
                        Dostępny
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}