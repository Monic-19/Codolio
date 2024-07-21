import { useState } from 'react';
import './App.css';
import data from './data/data';
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { motion } from "framer-motion";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import PieChart from './components/Piechart';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const monthly_data = data.filter(item => parseInt(item.dateTime.split(" ")[0].split("-")[1]) - 1 === currentMonthIndex)
  .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const [filteredData, setFilteredData] = useState<any[]>(aggregateByDate(monthly_data));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[currentMonthIndex];

  const handlePrevMonth = () => {
    let newMonthIndex = currentMonthIndex - 1;
    if (newMonthIndex < 0) {
      newMonthIndex = 11;
    }
    setCurrentMonthIndex(newMonthIndex);
  };

  const handleNextMonth = () => {
    let newMonthIndex = currentMonthIndex + 1;
    if (newMonthIndex > 11) {
      newMonthIndex = 0;
    }
    setCurrentMonthIndex(newMonthIndex);
  };

  function aggregateByDate(transactions: any) {
    const aggregatedData = transactions.reduce((acc: any, transaction: any) => {
      const date = transaction.dateTime.split(' ')[0];
      if (!acc[date]) {
        acc[date] = {
          date: date,
          totalIncome: 0,
          totalExpenditure: 0,
          transactions: []
        };
      }
      if (transaction.type === "Income") {
        acc[date].totalIncome += transaction.amount;
      } else if (transaction.type === "Expense") {
        acc[date].totalExpenditure += transaction.amount;
      }
      acc[date].transactions.push(transaction);
      return acc;
    }, {});

    return Object.values(aggregatedData);
  }

  const handleDelete = (transactionToDelete: any) => {
    const updatedData = filteredData.map(dayData => ({
      ...dayData,
      transactions: dayData.transactions.filter((trans: any) => trans.dateTime !== transactionToDelete.dateTime)
    }))
    .filter(dayData => dayData.transactions.length > 0); 
    setFilteredData(updatedData);
  };

  let monthlyIncome: number = 0, monthlyExpenditure: number = 0;
  let incomeLabels: string[] = [];
  let expenditureLabels: string[] = [];
  let incomeSeries: number[] = [];
  let expenditureSeries: number[] = [];

  const incomeMap: { [key: string]: number } = {};
  const expenditureMap: { [key: string]: number } = {};

  monthly_data.forEach((trans) => {
    if (trans.type === "Income") {
      monthlyIncome += trans.amount;
      incomeMap[trans.category] = (incomeMap[trans.category] || 0) + trans.amount;
    } else {
      monthlyExpenditure += trans.amount;
      expenditureMap[trans.category] = (expenditureMap[trans.category] || 0) + trans.amount;
    }
  });

  incomeLabels = Object.keys(incomeMap);
  incomeSeries = Object.values(incomeMap);

  expenditureLabels = Object.keys(expenditureMap);
  expenditureSeries = Object.values(expenditureMap);

  const incomechartData = {
    labels: incomeLabels,
    series: incomeSeries,
  };
  const expensechartData = {
    labels: expenditureLabels,
    series: expenditureSeries,
  };

  const uniqueCategories = [...new Set(data.map(transaction => transaction.category))];
  const uniqueCurrencies = [...new Set(data.map(transaction => transaction.currency))];

  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  const handleSearchTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTitle(e.target.value);
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value);
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCurrency(e.target.value);

  let finalfilteredData = aggregateByDate(monthly_data).filter((dayData: any) => {
    return (
      (selectedType === '' || dayData.transactions.some((trans: any) => trans.type.toLowerCase() === selectedType)) &&
      (selectedCategory === '' || dayData.transactions.some((trans: any) => trans.category === selectedCategory)) &&
      (selectedCurrency === '' || dayData.transactions.some((trans: any) => trans.currency === selectedCurrency)) &&
      (searchTitle === '' || dayData.transactions.some((trans: any) => trans.title.toLowerCase().includes(searchTitle.toLowerCase())))
    );
  });

  return (
    <div className={` ${darkMode ? "bg-[#292929]" : "bg-[#FB933D]"} min-h-[100vh] w-full flex justify-center items-center duration-500`}>

      <div className={` ${darkMode ? "bg-black" : "bg-white"} lg:min-h-[90vh] min-h-[95vh] lg:w-[95vw] w-[90vw] rounded-2xl shadow-2xl p-4 duration-500 my-[3vh] lg:my-7 `}>

        <div className='flex items-center justify-between h-[5vh] '>
          <div className='lg:h-[5vh] h-[4vh] flex items-center gap-2'>
            <img src="https://codolio.com/codolio_assets/codolio.svg" alt="logo" className='h-full object-cover' />
            <div className='lg:text-2xl text-xl font-bold flex'>
              <h1 className={`${darkMode ? "text-white" : "text-black"} duration-500`}>Cod</h1>
              <h1 className='text-[#FB933D]'>olio</h1>
            </div>
          </div>

          <div className={`${darkMode ? "text-white" : "text-black"} duration-500 cursor-pointer `}>
            {
              darkMode ?
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: "20deg" }}
                  whileHover={{ rotate: 0 }}
                  transition={{ duration: "500ms" }}
                >
                  <CiLight size={32} onClick={() => setDarkMode(prev => !prev)} />
                </motion.div>
                :
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: "-20deg" }}
                >
                  <MdOutlineDarkMode size={32} onClick={() => setDarkMode(prev => !prev)} />
                </motion.div>
            }
          </div>

        </div>

        <div className={`${darkMode ? "text-white" : "text-black"} duration-500 h-[7vh] lg:w-[30vw] w-full mt-3 mx-auto flex justify-evenly items-center lg:text-2xl text-xl font-bold cursor-pointer`}>
          <FaAngleDoubleLeft onClick={handlePrevMonth} />
          <h1 className='lg:w-[20vw] w-[40vw] text-center '>{currentMonth}</h1>
          <FaAngleDoubleRight onClick={handleNextMonth} />
        </div>

        <div className=' lg:h-[55vh] h-[100vh] w-full lg:mt-5 flex lg:flex-row flex-col justify-evenly items-center'>

          <div className={`${darkMode ? "bg-[#1F1E1F] " : "bg-white"} lg:h-full lg:w-[45%] h-[45%] w-[90%]  gap-2 border-2 rounded-xl duration-500 overflow-hidden border-green-500`}>
            <div className='h-[85%] flex justify-center items-center'>
              <PieChart data={incomechartData} />
            </div>
            <div className={`${!darkMode ? "text-white bg-green-500 " : "text-green-500"} duration-500 h-[15%] flex items-center justify-center lg:text-2xl text-xl uppercase tracking-wide `}>
              Income : {monthlyIncome.toFixed(2)}
            </div>
          </div>

          <div className={`${darkMode ? "bg-[#1F1E1F] " : "bg-white"} lg:h-full lg:w-[45%] h-[45%] w-[90%]  gap-2 border-2 rounded-xl duration-500 overflow-hidden border-red-500`}>
            <div className='h-[85%] flex justify-center items-center'>
              <PieChart data={expensechartData} />
            </div>
            <div className={`${!darkMode ? "text-white bg-red-500 " : "text-red-500"} h-[15%] flex items-center justify-center lg:text-2xl text-xl uppercase tracking-wide duration-500`}>
              Expense : {monthlyExpenditure.toFixed(2)}
            </div>
          </div>

        </div>

        <div className='lg:h-[10vh] h-[35vh] mt-5 flex items-center justify-evenly w-full lg:flex-row flex-col duration-500'>
          <div className='lg:w-[40%]'>
            <input
              type="text"
              placeholder='Search by Title'
              value={searchTitle}
              onChange={handleSearchTitleChange}
              className={`${darkMode ? "bg-[#1F1E1F] text-white " : ""} duration-500 lg:w-[90%] p-3 rounded-2xl border-2 outline-none`} />
          </div>
          <div className='flex lg:w-[50%] items-center lg:gap-5 gap-2 lg:flex-row flex-col lg:mt-0 -mt-3'>
            <select
              name="type"
              value={selectedType}
              onChange={handleTypeChange}
              className={`${darkMode ? "bg-[#1F1E1F] text-white " : ""} duration-500 lg:w-[30%] w-[50vw] h-[50%] p-3 rounded-2xl border-2 outline-none`}>
              <option value="">Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              name="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={`${darkMode ? "bg-[#1F1E1F] text-white " : ""} duration-500 lg:w-[30%] w-[50vw] p-3 rounded-2xl border-2 outline-none`}>
              <option value="">Category</option>
              {
                uniqueCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))
              }
            </select>
            <select
              name="currency"
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className={`${darkMode ? "bg-[#1F1E1F] text-white " : ""} duration-500 lg:w-[30%] w-[50vw] p-3 rounded-2xl border-2 outline-none`}>
              <option value="">Currency</option>
              {
                uniqueCurrencies.map((currency, index) => (
                  <option key={index} value={currency}>{currency}</option>
                ))
              }
            </select>

            <div className={`${darkMode ? "bg-[#FB933D] text-white" : "border-[#FB933D] border-2 text-[#FB933D]"} p-1 items-center justify-center flex text-3xl rounded-full group duration-500 lg:mt-0 mt-2`}>
              <IoIosAdd className='group-hover:rotate-90 duration-500' />
            </div>

          </div>

        </div>

        <div className='min-h-[12vh] w-full p-4 flex flex-col gap-6 duration-300'>
          {
            finalfilteredData.map((dayData: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn", delay: 0.125 * index }}
                key={index}
                className={`${darkMode ? "bg-[#292929] text-gray-200" : "bg-gray-100 text-black"} min-h-[11vh] rounded-2xl overflow-hidden`}>

                <div className='h-[5vh] rounded-t-2xl border-b-2 flex items-center justify-between lg:text-lg text-base'>
                  <h1 className='lg:ml-3 ml-2'>Date: {dayData.date.split("-")[2]}</h1>
                  <div className='flex gap-4 cursor-default font-extrabold lg:mr-2 mr-3  lg:w-[20%] justify-evenly'>
                    <h1 className='text-green-500'> + {dayData.totalIncome.toFixed(2)}</h1>
                    <h1 className='text-red-500'> - {dayData.totalExpenditure.toFixed(2)}</h1>
                  </div>
                </div>

                <div className='min-h-[6vh] mt-2 lg:px-4 px-2 py-2 duration-300'>
                  {dayData.transactions.map((transaction: any, txnIndex: number) => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeIn" }}
                      key={txnIndex}
                      className='flex items-center justify-between lg:px-4 px-2'>
                      <div className='lg:text-lg text-sm w-[40%]'>
                        <h1>{transaction.title}</h1>
                      </div>
                      <div className='lg:text-lg text-sm lg:w-[10%]'>
                        <h1 className={`${transaction.type === "Expense" ? "text-red-500" : "text-green-500"}`}>
                          {transaction.amount.toFixed(2)}
                        </h1>
                      </div>
                      <div className='flex lg:gap-4 gap-2'>
                        <CiEdit className='lg:text-2xl text-xl cursor-pointer text-blue-500 hover:text-blue-800 duration-300' />
                        <MdDeleteForever 
                          onClick={() => handleDelete(transaction)}
                          className='lg:text-2xl text-xl cursor-pointer text-red-500 hover:text-red-800 duration-300' />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          }
        </div>

        <div className={`lg:h-[50vh] lg:w-[50vh] h-[50vw]  bg-purple-400`}>
          <div className='h-[5vh] flex lg:text-xl text-base text-white'>
            <div className='h-full w-1/2 flex items-center justify-center bg-green-500'>Income</div>
            <div className='h-full w-1/2 flex items-center justify-center'>Expense</div>
          </div>
          <div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
