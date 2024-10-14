import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  //Удаление всего
  await prisma.employee.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.region.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.workSchedule.deleteMany({});
  await prisma.position.deleteMany({});

  // Создание стран
  const countries = await Promise.all([
    prisma.country.create({
      data: {
        name: "Россия",
      },
    }),
    prisma.country.create({
      data: {
        name: "США",
      },
    }),
  ]);

  // Создание регионов
  const regions = await Promise.all([
    prisma.region.create({
      data: {
        name: "Москва",
        countryId: countries[0].id, // ID первой страны
      },
    }),
    prisma.region.create({
      data: {
        name: "Калифорния",
        countryId: countries[1].id, // ID второй страны
      },
    }),
  ]);

  // Создание расписаний работы
  const workSchedules = await Promise.all([
    prisma.workSchedule.create({
      data: {
        sunday: false,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        start: new Date("2024-01-01T09:00:00Z"),
        end: new Date("2024-01-01T18:00:00Z"),
      },
    }),
    prisma.workSchedule.create({
      data: {
        sunday: true,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: true,
        start: new Date("2024-01-01T10:00:00Z"),
        end: new Date("2024-01-01T15:00:00Z"),
      },
    }),
  ]);

  // Создание компаний
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        type: "myCompanies",
        name: "Компания 1",
        description: "Описание компании 1",
        phone: "1234567890",
        email: "company1@example.com",
        site: "https://company1.com",
        workScheduleId: workSchedules[0].id,
        countryId: countries[0].id,
        regionId: regions[0].id,
      },
    }),
    prisma.company.create({
      data: {
        type: "partner",
        name: "Компания 2",
        description: "Описание компании 2",
        phone: "0987654321",
        email: "company2@example.com",
        site: "https://company2.com",
        isFavorite : true,
        workScheduleId: workSchedules[1].id,
        countryId: countries[1].id,
        regionId: regions[1].id,
      },
    }),
  ]);

  // Создание должностей
  const positions = await Promise.all([
    prisma.position.create({
      data: {
        title: "Менеджер",
      },
    }),
    prisma.position.create({
      data: {
        title: "Разработчик",
      },
    }),
    prisma.position.create({
      data: {
        title: "Директор",
      },
    }),
    prisma.position.create({
      data: {
        title: "Android разработчик",
      },
    }),
  ]);

  // Создание сотрудников
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name : 'IvaI',
        fullName: "Иван Иванов",
        type: "staff",
        positionId: positions[0].id,
        companyId: companies[0].id,
        status: "fullDay",
        phone: "1112223333",
        email: "ivan@example.com",
        maritalStatus: "single",
        CarOwnership: true,
        drivingLicense: "B",
        hasDisability: false,
        hasCriminalRecord: false,
        pensioner: false,
        notAbroad: true,
        experience: {
          create: [
            {
              company: "kcel",
              position: "Старший менеджер",
              start: new Date("2020-01-01"),
              end: new Date("2022-01-01"),
              responsibilities: "Управление проектами",
              countryId: countries[0].id,
              regionId: regions[0].id,
            },
          ],
        },
        education: {
          create: [
            {
              level: "higherEducation",
              name: "Университет",
              faculty: "Экономический",
              speciality: "Менеджмент",
              start: new Date("2015-01-01"),
              end: new Date("2019-01-01"),
            },
          ],
        },
      },
    }),
    prisma.employee.create({
      data: {
        name : 'PetP',
        fullName: "Петр Петров",
        type: "candidate",
        positionId: positions[1].id,
        companyId: companies[1].id,
        status: "freelancer",
        phone: "4445556666",
        email: "petr@example.com",
        maritalStatus: "married",
        CarOwnership: false,
        drivingLicense: "noLicense",
        hasDisability: false,
        hasCriminalRecord: false,
        pensioner: false,
        notAbroad: true,
        isFavorite : true,
        experience: {
          create: [
            {
              company: "spotify",
              position: "Младший разработчик",
              start: new Date("2021-01-01"),
              end: null, // Настоящее время
              responsibilities: "Разработка веб-приложений",
              countryId: countries[1].id,
              regionId: regions[1].id,
            },
          ],
        },
        education: {
          create: [
            {
              level: "bachelor",
              name: "Технический университет",
              faculty: "Компьютерных наук",
              speciality: "Программирование",
              start: new Date("2016-01-01"),
              end: new Date("2020-01-01"),
            },
          ],
        },
      },
    }),
    prisma.employee.create({
      data: {
        name : 'MiraSa',
        fullName: "Мирай Сато",
        type: "staff",
        positionId: positions[1].id,
        companyId: companies[0].id,
        status: "fullDay",
        phone: "1112223333",
        email: "sowwy@example.com",
        maritalStatus: 'notSpecified',
        CarOwnership: true,
        drivingLicense: "B",
        hasDisability: false,
        hasCriminalRecord: false,
        pensioner: false,
        notAbroad: true,
        experience: {
          create: [
            {
              company: "kcel",
              position: "HR",
              start: new Date("2021-01-01"),
              end: new Date("2022-05-01"),
              responsibilities: "Поиск сотрудников",
              countryId: countries[0].id,
              regionId: regions[1].id,
            },
          ],
        },
        education: {
          create: [
            {
              level: "higherEducation",
              name: "Университет antragent",
              faculty: "Экономический",
              speciality: "Менеджмент",
              start: new Date("2013-01-01"),
              end: new Date("2016-01-01"),
            },
          ],
        },
      },
    }),
    prisma.employee.create({
      data: {
        name : 'kitakita',
        fullName: "Икуё Кита",
        type: "staff",
        positionId: positions[0].id,
        companyId: companies[1].id,
        status: 'workingStudent',
        phone: "1112223333",
        email: "kitaktiakita@example.com",
        maritalStatus: "single",
        CarOwnership: true,
        drivingLicense: "A",
        hasDisability: false,
        hasCriminalRecord: false,
        pensioner: false,
        notAbroad: true,
        experience: {
          create: [
            {
              company: "kaspi",
              position: "Разработчик",
              start: new Date("2021-01-01"),
              end: new Date("2021-10-01"),
              responsibilities: "Разработка",
              countryId: countries[0].id,
              regionId: regions[0].id,
            },
          ],
        },
        education: {
          create: [
            {
              level: "higherEducation",
              name: "хеклин",
              faculty: "IT",
              speciality: "Разработка ПО",
              start: new Date("2022-01-01"),
              end: null,
            },
          ],
        },
      },
    }),
    prisma.employee.create({
      data: {
        name : 'iwakura',
        fullName: "Лейн Ивакура",
        type: "staff",
        positionId: positions[2].id,
        companyId: companies[0].id,
        status: "fullDay",
        phone: "1112223333",
        email: "iwakuralove@example.com",
        maritalStatus: "single",
        CarOwnership: false,
        drivingLicense: 'noLicense',
        hasDisability: false,
        hasCriminalRecord: false,
        pensioner: false,
        notAbroad: true,
        experience: {
          create: [
            {
              company: "beeline",
              position: "менеджер",
              start: new Date("2019-01-01"),
              end: new Date("2022-01-01"),
              responsibilities: "Управление сотрудниками",
              countryId: countries[0].id,
              regionId: regions[0].id,
            },
          ],
        },
        education: {
          create: [
            {
              level: 'bachelor',
              name: "Центральный университет ",
              faculty: "Социологический",
              speciality: "Дипломатия",
              start: new Date("2015-01-01"),
              end: new Date("2019-01-01"),
            },
          ],
        },
      },
    }),
  ]);

  console.log({ countries, regions, companies, employees });
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
