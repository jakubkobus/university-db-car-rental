import 'dotenv/config';
import {
  PrismaClient,
  Role,
  FuelType,
  Transmission,
  MileageUnit,
  RentalStatus,
  MaintenanceType,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  console.log('Starting seeding...');

  await prisma.review.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.maintenance.deleteMany();
  await prisma.car.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Deleted old data.');

  const salt = await bcrypt.genSalt();
  const passwordAdmin = await bcrypt.hash('admin123', salt);
  const passwordEmployee = await bcrypt.hash('worker123', salt);
  const passwordUser = await bcrypt.hash('user123', salt);

  await prisma.user.create({
    data: {
      email: 'admin@rental.com',
      password: passwordAdmin,
      firstName: 'Adam',
      lastName: 'Administrator',
      role: Role.ADMIN,
      phone: '+48 111 222 333',
    },
  });

  await prisma.user.create({
    data: {
      email: 'pracownik@rental.com',
      password: passwordEmployee,
      firstName: 'Piotr',
      lastName: 'Pracowity',
      role: Role.EMPLOYEE,
      phone: '+48 999 888 777',
    },
  });

  const client1 = await prisma.user.create({
    data: {
      email: 'jan@kowalski.com',
      password: passwordUser,
      firstName: 'Jan',
      lastName: 'Kowalski',
      role: Role.USER,
      phone: '+48 500 600 700',
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'anna@nowak.com',
      password: passwordUser,
      firstName: 'Anna',
      lastName: 'Nowak',
      role: Role.USER,
      phone: '+48 600 700 800',
    },
  });

  const catSuv = await prisma.category.create({
    data: { name: 'SUV', description: 'Przestronne i terenowe' },
  });
  const catSport = await prisma.category.create({
    data: { name: 'Sport', description: 'Szybkie i emocjonujące' },
  });
  const catSedan = await prisma.category.create({
    data: { name: 'Sedan', description: 'Komfortowe na trasy' },
  });
  const catEco = await prisma.category.create({
    data: { name: 'City / Eco', description: 'Ekonomiczne do miasta' },
  });

  const fGps = await prisma.feature.create({
    data: { name: 'GPS', icon: 'map-pin' },
  });
  const fAc = await prisma.feature.create({
    data: { name: 'Klimatyzacja 4-strefowa', icon: 'thermometer' },
  });
  const fAuto = await prisma.feature.create({
    data: { name: 'Autopilot', icon: 'cpu' },
  });
  const fLeather = await prisma.feature.create({
    data: { name: 'Skórzane fotele', icon: 'armchair' },
  });
  const fSunroof = await prisma.feature.create({
    data: { name: 'Szyberdach', icon: 'sun' },
  });

  // Toyota RAV4 (available)
  await prisma.car.create({
    data: {
      brand: 'Toyota',
      model: 'RAV4',
      year: 2023,
      plateNumber: 'DW 12345',
      color: 'Biała Perła',
      description: 'Idealny SUV dla rodziny. Hybryda plug-in.',
      mileage: 15400,
      fuelType: FuelType.HYBRID,
      transmission: Transmission.AUTOMATIC,
      engineSize: 2.5,
      horsePower: 306,
      pricePerDay: 250,
      deposit: 1000,
      categoryId: catSuv.id,
      imageUrl:
        'https://e-mobilni.pl/wp-content/uploads/2023/09/toyota-rav4-phev-2023-1.jpg',
      features: {
        connect: [{ id: fGps.id }, { id: fAc.id }],
      },
    },
  });

  // BMW M3 Competition (available)
  await prisma.car.create({
    data: {
      brand: 'BMW',
      model: 'M3 Competition',
      year: 2022,
      plateNumber: 'W0 SPEED',
      color: 'Isle of Man Green',
      description: 'Bestia na tor i na ulicę.',
      mileage: 8000,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      engineSize: 3.0,
      horsePower: 510,
      pricePerDay: 800,
      deposit: 5000,
      categoryId: catSport.id,
      imageUrl: 'https://img.chceauto.pl/bmw/3/bmw-3-sedan-4638-52295_v1.webp',
      features: {
        connect: [{ id: fGps.id }, { id: fLeather.id }, { id: fSunroof.id }],
      },
    },
  });

  // Tesla Model 3 Long Range (not available)
  const car3 = await prisma.car.create({
    data: {
      brand: 'Tesla',
      model: 'Model 3 Long Range',
      year: 2024,
      plateNumber: 'EL TESLA',
      color: 'Czerwony',
      mileage: 2000,
      fuelType: FuelType.ELECTRIC,
      transmission: Transmission.AUTOMATIC,
      horsePower: 490,
      pricePerDay: 400,
      deposit: 2000,
      isAvailable: false,
      categoryId: catSedan.id,
      imageUrl:
        'https://media.carsandbids.com/cdn-cgi/image/width=2080,quality=70/39ba75f9b610a05237adc3ca976891cd48f5832c/photos/rGe22aq4-Va1cqtSEXb-(edit).jpg?t=172138681715',
      features: {
        connect: [{ id: fAuto.id }, { id: fGps.id }, { id: fAc.id }],
      },
    },
  });

  // Fiat 500e (available)
  await prisma.car.create({
    data: {
      brand: 'Fiat',
      model: '500e',
      year: 2021,
      plateNumber: 'KR CITY',
      color: 'Niebieski',
      description: 'Idealny do parkowania w centrum.',
      mileage: 35000,
      fuelType: FuelType.ELECTRIC,
      transmission: Transmission.AUTOMATIC,
      horsePower: 118,
      pricePerDay: 120,
      deposit: 500,
      categoryId: catEco.id,
      imageUrl:
        'https://electricmobility.store/car/fiat-500e-hatchback-24-kwh/fiat_500e_hatchback_2020-01/',
      features: {
        connect: [{ id: fAc.id }],
      },
    },
  });

  // Ford Mustang GT (not available)
  const car5 = await prisma.car.create({
    data: {
      brand: 'Ford',
      model: 'Mustang GT',
      year: 2020,
      plateNumber: 'PO V8PWR',
      color: 'Czarny',
      mileage: 45000,
      mileageUnit: MileageUnit.MILE,
      fuelType: FuelType.PETROL,
      transmission: Transmission.MANUAL,
      engineSize: 5.0,
      horsePower: 450,
      pricePerDay: 500,
      deposit: 2500,
      categoryId: catSport.id,
      imageUrl:
        'https://cdn.dealeraccelerate.com/modern/1/267/14019/1920x1440/2020-ford-mustang-gt-premium-perf-package-ii-fastback',
      features: {
        connect: [{ id: fLeather.id }],
      },
    },
  });

  // Volkswagen Passat Variant (ongoing rental)
  const car6 = await prisma.car.create({
    data: {
      brand: 'Volkswagen',
      model: 'Passat Variant',
      year: 2019,
      plateNumber: 'GD DIESEL',
      color: 'Srebrny',
      description: 'Król polskich autostrad.',
      mileage: 120000,
      fuelType: FuelType.DIESEL,
      transmission: Transmission.AUTOMATIC,
      engineSize: 2.0,
      horsePower: 190,
      pricePerDay: 180,
      deposit: 800,
      categoryId: catSedan.id,
      imageUrl:
        'https://namasce.pl/wp-content/uploads/2019/02/volkswagen_passat_variant_r-line_2019_1.jpg',
      features: {
        connect: [{ id: fGps.id }, { id: fAc.id }],
      },
    },
  });

  // Porsche 811 gt3rs (upcoming rental)
  const car7 = await prisma.car.create({
    data: {
      brand: 'Porsche',
      model: '911 GT3RS',
      year: 2023,
      plateNumber: 'K0 GT3RS',
      color: 'Błękitny',
      description: 'Supersamochód na każdą okazję.',
      mileage: 1200,
      fuelType: FuelType.PETROL,
      transmission: Transmission.AUTOMATIC,
      engineSize: 3.0,
      horsePower: 500,
      pricePerDay: 1000,
      deposit: 2500,
      categoryId: catSport.id,
      imageUrl:
        'https://media.craiyon.com/2025-07-16/03SsmqYzTNGYnBd1ec5kfQ.webp',
      features: {
        connect: [{ id: fGps.id }, { id: fAc.id }],
      },
    },
  });

  await prisma.rental.create({
    data: {
      startDate: new Date('2023-12-01T10:00:00Z'),
      endDate: new Date('2023-12-05T10:00:00Z'),
      status: RentalStatus.COMPLETED,
      totalPrice: 1000,
      userId: client1.id,
      carId: car3.id,
    },
  });

  await prisma.rental.create({
    data: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 10)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: RentalStatus.ONGOING,
      totalPrice: 900,
      userId: client2.id,
      carId: car6.id,
    },
  });

  await prisma.rental.create({
    data: {
      startDate: new Date(new Date().setDate(new Date().getDate() + 20)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 27)),
      status: RentalStatus.CONFIRMED,
      totalPrice: 3500,
      userId: client1.id,
      carId: car5.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Świetne auto, bardzo oszczędne!',
      userId: client1.id,
      carId: car3.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Super przyspieszenie, ale dużo pali.',
      userId: client1.id,
      carId: car5.id,
    },
  });

  await prisma.maintenance.create({
    data: {
      type: MaintenanceType.REPAIR,
      description: 'Wymiana wahacza po wjechaniu w dziurę.',
      cost: 1500,
      date: new Date(),
      mileage: 2000,
      carId: car3.id,
    },
  });

  console.log('Seeding completed successfully');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
