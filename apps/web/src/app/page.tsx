import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Car } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getCars(): Promise<Car[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch cars');
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

export default async function Home() {
  const cars = await getCars();
  
  const featuredCars = cars.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-900 text-white py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Wypożyczalnia Samochodów
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Oferujemy szeroki wybór pojazdów. 
            Od ekonomicznych aut miejskich po luksusowe limuzyny.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="#oferta">
                Zobacz ofertę
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 text-black bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors">
              <Link href="/contact">
                Kontakt
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="oferta" className="py-16 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Nasza flota</h2>
            {cars.length > 6 && (
              <Button variant="ghost" className="flex items-center gap-2" asChild>
                <Link href="/cars">
                  Wszystkie samochody <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>

          {featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-xl">Obecnie nie mamy dostępnych samochodów.</p>
              <p>Spróbuj ponownie później.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Wybierz auto</h3>
              <p className="text-muted-foreground">Przeglądaj naszą bogatą ofertę i wybierz model idealny dla siebie.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Zarezerwuj online</h3>
              <p className="text-muted-foreground">Prosty i szybki proces rezerwacji bez zbędnych formalności.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Ruszaj w drogę</h3>
              <p className="text-muted-foreground">Odbierz kluczyki w wybranym punkcie i ciesz się jazdą.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}