export const getFormattedDate = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
};

export const categories = [
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Clothing", label: "Clothing" },
  { value: "Accessories", label: "Accessories" },
  { value: "Vehicle", label: "Vehicle" },
  { value: "Sports", label: "Sports" },
  { value: "Books", label: "Books" },
  { value: "Kids", label: "Kids" },
  { value: "Beauty", label: "Beauty" },
  { value: "Health", label: "Health" },
  { value: "Groceries", label: "Groceries" },
  { value: "Other", label: "Other" },
];
