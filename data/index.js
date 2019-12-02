
/******************************************************************/
const data = {
  coffee: [
    { name: 'Vanilla Latte', size: 'Grande', pumpsOfSyrup: 3, isEspresso: true },
    { name: 'Cafe au Lait', size: 'Venti', isEspresso: false },
  ],
  carrots: [
    { label: 'Baby Carrots', weight: '16oz', starRating: 5 },
    { label: 'Organic Baby Carrots', weight: '16oz', starRating: 5 },
  ]
};

module.exports = { ...data };
