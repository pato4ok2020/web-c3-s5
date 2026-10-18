import { db } from './db';

async function main() {
  await db.orm.public.Feedback.where({}).deleteAll();
  await db.orm.public.OrderPosition.where({}).deleteAll();
  await db.orm.public.Order.where({}).deleteAll();
  await db.orm.public.Basket.where({}).deleteAll();
  await db.orm.public.Product.where({}).deleteAll();
  await db.orm.public.Client.where({}).deleteAll();
  await db.orm.public.Company.where({}).deleteAll();
  await db.orm.public.User.where({}).deleteAll();

  const uIvan = await db.orm.public.User.create({
    email: 'ivan@mail.ru',
    password: 'hash_ivan',
    role: 'CLIENT',
  });
  const uAnna = await db.orm.public.User.create({
    email: 'anna@mail.ru',
    password: 'hash_anna',
    role: 'CLIENT',
  });
  const uPizza = await db.orm.public.User.create({
    email: 'pizza@rome.ru',
    password: 'hash_pizza',
    role: 'COMPANY',
  });
  const uSushi = await db.orm.public.User.create({
    email: 'sushi@tokyo.ru',
    password: 'hash_sushi',
    role: 'COMPANY',
  });

  const ivan = await db.orm.public.Client.create({
    name: 'Иван Петров',
    userId: uIvan.id,
  });
  const anna = await db.orm.public.Client.create({
    name: 'Анна Смирнова',
    userId: uAnna.id,
  });

  const pizza = await db.orm.public.Company.create({
    name: 'Пицца Рим',
    description: 'Итальянская пицца и паста',
    imageUrl: 'https://example.com/pizza.png',
    userId: uPizza.id,
  });
  const sushi = await db.orm.public.Company.create({
    name: 'Суши Токио',
    description: 'Роллы, суши и супы',
    imageUrl: null,
    userId: uSushi.id,
  });

  const margherita = await db.orm.public.Product.create({
    name: 'Пицца Маргарита',
    cost: 590,
    amount: 30,
    imageUrl: 'https://example.com/margherita.png',
    isAvailable: true,
    companyId: pizza.id,
  });
  const carbonara = await db.orm.public.Product.create({
    name: 'Паста Карбонара',
    cost: 450,
    amount: 20,
    imageUrl: null,
    isAvailable: true,
    companyId: pizza.id,
  });
  const philadelphia = await db.orm.public.Product.create({
    name: 'Ролл Филадельфия',
    cost: 520,
    amount: 25,
    imageUrl: null,
    isAvailable: true,
    companyId: sushi.id,
  });
  await db.orm.public.Product.create({
    name: 'Мисо-суп',
    cost: 280,
    amount: 0,
    imageUrl: null,
    isAvailable: false,
    companyId: sushi.id,
  });

  await db.orm.public.Basket.createAll([
    { clientId: ivan.id, productId: carbonara.id, amount: 2 },
    { clientId: anna.id, productId: philadelphia.id, amount: 1 },
  ]);

  const order1 = await db.orm.public.Order.create({
    status: 'COOKING',
    address: 'г. Москва, ул. Ленина, 10, кв. 5',
    clientId: ivan.id,
    companyId: pizza.id,
  });
  const order2 = await db.orm.public.Order.create({
    status: 'DELIVERED',
    address: 'г. Казань, ул. Баумана, 5, кв. 12',
    clientId: anna.id,
    companyId: sushi.id,
  });

  await db.orm.public.OrderPosition.createAll([
    { orderId: order1.id, productId: margherita.id, amount: 1, cost: 590 },
    { orderId: order1.id, productId: carbonara.id, amount: 1, cost: 450 },
    { orderId: order2.id, productId: philadelphia.id, amount: 2, cost: 1040 },
  ]);

  await db.orm.public.Feedback.createAll([
    {
      clientId: anna.id,
      companyId: sushi.id,
      rate: 5,
      text: 'Привезли горячим, очень вкусно',
    },
    { clientId: ivan.id, companyId: pizza.id, rate: 4, text: null },
  ]);

  console.log('Все гуд');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.close());
