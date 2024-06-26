function getCurrentDate(offset = 0) {
  const date = new Date();
  date.setMonth(date.getMonth() - offset);
  const timezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .split("T")[0];
  return localISOTime;
}

export const dummyExpensesData = [
  {
    amount: 100,
    category: "FOOD",
    date: getCurrentDate(),
    description: "Test Data",
    id: 1,
    userEmail: "test@gmail.com",
  },
  {
    amount: 100,
    category: "GIFT",
    date: getCurrentDate(),
    description: "Test Data",
    id: 2,
    userEmail: "test@gmail.com",
  },
  {
    amount: 100,
    category: "ENTERTAINMENT",
    date: getCurrentDate(),
    description: "Test Data",
    id: 3,
    userEmail: "test@gmail.com",
  },
  {
    amount: 1000,
    category: "INCOME",
    date: getCurrentDate(),
    description: "Test Data",
    id: 4,
    userEmail: "test@gmail.com",
  },
  {
    amount: 100,
    category: "UTILITIES",
    date: getCurrentDate(),
    description: "Test Data",
    id: 7,
    userEmail: "test@gmail.com",
  },
  {
    amount: 100,
    category: "HOUSING",
    date: getCurrentDate(),
    description: "Test Data",
    id: 8,
    userEmail: "test@gmail.com",
  },
  {
    amount: 100,
    category: "EDUCATION",
    date: getCurrentDate(),
    description: "Test Data",
    id: 11,
    userEmail: "test@gmail.com",
  },
  {
    amount: 100,
    category: "PROFIT",
    date: getCurrentDate(),
    description: "Test Data",
    id: 12,
    userEmail: "test@gmail.com",
  },
  {
    amount: 100,
    category: "MISCELLANEOUS",
    date: getCurrentDate(),
    description: "Test Data",
    id: 13,
    userEmail: "test@gmail.com",
  },
  {
    amount: 100,
    category: "TRANSPORTATION",
    date: getCurrentDate(),
    description: "Test Data",
    id: 9,
    userEmail: "test@gmail.com",
  },
  {
    amount: 500,
    category: "MISCELLANEOUS",
    date: getCurrentDate(1),
    description: "Test Data",
    id: 5,
    userEmail: "test@gmail.com",
  },
  {
    amount: 1100,
    category: "HOUSING",
    date: getCurrentDate(2),
    description: "Test Data",
    id: 6,
    userEmail: "test@gmail.com",
  },
  {
    amount: 900,
    category: "GIFT",
    date: getCurrentDate(3),
    description: "Test Data",
    id: 10,
    userEmail: "test@gmail.com",
  },
  {
    amount: 600,
    category: "GIFT",
    date: getCurrentDate(4),
    description: "Test Data",
    id: 14,
    userEmail: "test@gmail.com",
  },
  {
    amount: 900,
    category: "GIFT",
    date: new Date(2023, 5, 12).toString(),
    description: "Test Data",
    id: 99,
    userEmail: "test@gmail.com",
  },
];
