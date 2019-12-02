const Dals = require('./dals');
const TransactionService = require('./transaction-service');
const Data = require('./data');


const transactionTest = async () => {

    /******************************************************************/
    // Single collection test
    /******************************************************************/
    const sessionOne = await TransactionService.startNewSession();

    await Dals.carrots.create(Data.carrots, { session: sessionOne });

    // Data is not inserted...
    const found1 = await Dals.carrots.find({});
    console.log('1. Before transaction is saved...', found1);

    // Finding data within the session...
    const found2 = await Dals.carrots.findOne({ label: Data.carrots[0].label }).session(sessionOne);
    console.log('2. Within the unsaved transaction...', found2._id);

    await sessionOne.commitTransaction();
    // NOW data is inserted...
    const found3 = await Dals.carrots.findOne({ label: Data.carrots[0].label });
    console.log('3. After transaction is saved...', found3._id);

    /******************************************************************/
    // Simultaenous transactions test
    /******************************************************************/
    const sessionTwo = await TransactionService.startNewSession();
    const sessionThree = await TransactionService.startNewSession();

    await Dals.coffee.create([Data.coffee[0]], { session: sessionTwo });
    await Dals.coffee.create([Data.coffee[1]], { session: sessionThree });

    // Data is not inserted...
    const found4 = await Dals.coffee.find({});
    console.log('4. Before simultaenous transactions are saved...', found4);

    await Promise.all([
      sessionTwo.commitTransaction(),
      sessionThree.commitTransaction(),
    ]);

    // NOW data is inserted...
    const found5 = await Dals.coffee.find({});
    console.log('5. After transactions are saved...', found5.map(f => f._id));

    /******************************************************************/
    // Multiple collections test
    /******************************************************************/
    const sessionFour = await TransactionService.startNewSession();

    await Dals.carrots.create(Data.carrots, { session: sessionFour });
    await Dals.coffee.create(Data.coffee, { session: sessionFour });

    const [{ _id: createdCarrot }] = await Dals.carrots.find({}).session(sessionFour);
    const [{ _id: createdCoffee }] = await Dals.coffee.find({}).session(sessionFour);

    await sessionFour.commitTransaction();
    // NOW data is inserted...
    const found6 = await Dals.carrots.findOne({ _id: createdCarrot });
    const found7 = await Dals.coffee.findOne({ _id: createdCoffee });
    console.log('6. Multi-collection successful...', found6._id, found7._id);
};

(async () => {

  try {
    /******************************************************************/
    const connectionParams = {
      mongoUrl: 'mongodb+srv://ttest:0CU7dtjCc1zvHtoq@cluster0-hkwuq.mongodb.net/ttest?retryWrites=true&w=majority',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }
    await Dals.connectAndInit(connectionParams);
    await Dals.dropCollections();
    await transactionTest();
  }
  catch (err) {
    /******************************************************************/
    console.log('*************************** error', err);
  }
  finally {
    /******************************************************************/
    await Dals.closeConnection();
  }
})();
