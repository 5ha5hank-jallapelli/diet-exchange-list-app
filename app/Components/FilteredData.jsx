import { data } from "autoprefixer";
import { useState, useEffect } from "react"

export default function FilteredData({ data, exchangeCount, category, handleDropdownClick, onIncreaseCount, onDecreaseCount, showDropdownMenu, dropdownToggle }) {
	const [filteredData, setFilteredData] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [allData, setAllData] = useState([]);

	const categories = {
		'none': "None",
		'cereals': "Cereals",
		'pulses': "Pulses",
		'nuts_and_oilseeds': "Nuts & OilSeeds",
		'meat_and_poultry': "Meat and Poultry",
		'seafood': "Seafood"
	}

	useEffect(() => {

		const loadData = data.map(item => {
			item.items.map(i => {
				// setAllData([{...i}])
			})
		});
	})

	function filterData(category) {
		data.forEach(item => {
			if (item.id === category && category !== 'none') {
				setFilteredData((oldData) => {
					oldData = [];
					return item.items
				})
			}
		});
		handleDropdownClick(category);
	}

	function handleIncreaseCount() {
		const updatedData = filteredData.map(item => {
			return {...item, 
				quantity: item.quantity + item.default.quantity,
				carbohydrates: item.carbohydrates + item.default.carbohydrates,
				proteins: item.proteins + item.default.proteins,
				fats: (item.fats + item.default.fats),
				energy: item.energy + item.default.energy }
		})
		
		setFilteredData(updatedData)

		onIncreaseCount();
	}
	
	function handleDecreaseCount() {
		const updatedData = filteredData.map(item => {
			return {...item, 
				quantity: item.quantity - item.default.quantity,
				carbohydrates: item.carbohydrates - item.default.carbohydrates,
				proteins: item.proteins - item.default.proteins,
				fats: item.fats - item.default.fats,
				energy: item.energy - item.default.energy
			}
		})
		
		setFilteredData(updatedData)

		onDecreaseCount();
	}

	function handleSearch(event) {
		const inputValue = event.target.value;
		setSearchQuery(inputValue);
		console.log(searchQuery.length);
		setFilteredData(searchedData(searchQuery));
		
	}

	function searchedData(query) {
		const tempData = [];
		data.map(item => {
			item.items.forEach(it => {
				if (it.item.includes(query)) {
					tempData.push(it)
				}
			})
		});
		return tempData;
	}

	return (
		<div>
			<div className="flex justify-between items-center gap-4">
				<div className="flex items-center">
					<ul className="relative">
						<button className="shadow-md bg-white py-1 px-4 border rounded-[6px] border-gray-200" onClick={showDropdownMenu}>{categories[category]}</button>
						<ul className={`${dropdownToggle ? 'active block' : 'hidden'} absolute top-[100%] bg-white shadow-md right-0 text-left py-1 min-w-[150px]`} >
							<li className="relative py-1 px-2 hover:bg-gray-200 cursor-pointer" onClick={() => filterData('none')}>None</li>
							<li className="relative py-1 px-2 hover:bg-gray-200 cursor-pointer" onClick={() => filterData('cereals')}>Cereals</li>
							<li className="relative py-1 px-2 hover:bg-gray-200 cursor-pointer" onClick={() => filterData('pulses')}>Pulses</li>
							<li className="relative py-1 px-2 hover:bg-gray-200 cursor-pointer" onClick={() => filterData('nuts_and_oilseeds')}>Nuts & Oil Seeds</li>
							<li className="relative py-1 px-2 hover:bg-gray-200 cursor-pointer" onClick={() => filterData('meat_and_poultry')}>Meat & Poultry</li>
							<li className="relative py-1 px-2 hover:bg-gray-200 cursor-pointer" onClick={() => filterData('seafood')}>Seafood</li>
						</ul>
					</ul>
				</div>
				<div className="flex flex-1">
					<input type="text" placeholder="Search Food Item..." onChange={handleSearch} className=" focus-visible:border-gray-400 focus-visible:outline-none border border-gray-200 px-2 py-1 rounded-md w-full" id="search" name="search" />
				</div>
				<div>
					<button className="shadow-md bg-white px-3 py-1 border border-gray-100 rounded-[50%] disabled:opacity-30" onClick={() => handleDecreaseCount()} disabled={exchangeCount == 1}>-</button>
						<span className="inline-block mx-4">{ exchangeCount }</span>
					<button className="shadow-md bg-white px-3 py-1 border border-gray-100 rounded-[50%]" onClick={() => handleIncreaseCount()}>+</button>
				</div>
			</div>
			<div className="mt-8">
				<table className={`${filteredData.length || searchQuery.length > 0 ? 'block' : 'hidden'} table-auto border-separate border border-slate-500 min-w-[920px]`}>
					<thead>
						<tr>
							<th className='text-left px-4 border border-slate-700'>Food Item</th>
							<th className='text-left px-4 border border-slate-700'>Amount(g)</th>
							<th className='text-left px-4 border border-slate-700'>Carbohydrates(g)</th>
							<th className='text-left px-4 border border-slate-700'>Proteins(g)</th>
							<th className='text-left px-4 border border-slate-700'>Fats(g)</th>
							<th className='text-left px-4 border border-slate-700'>Energy(kcal)</th>
						</tr>
					</thead>
					<tbody>
						{ filteredData.map((item, index) => {
							return (
								<tr key={`${item}_${index}`}>
									<td className='text-left border px-4 border-slate-700'>{item.item}</td>
									<td className='text-center border px-4 border-slate-700'>{(item.quantity).toFixed(2)}</td>
									<td className='text-center border px-4 border-slate-700'>{item.carbohydrates ? (item.carbohydrates).toFixed(2) : '--' }</td>
									<td className='text-center border px-4 border-slate-700'>{(item.proteins).toFixed(2)}</td>
									<td className='text-center border px-4 border-slate-700'>{(item.fats).toFixed(2)}</td>
									<td className='text-center border px-4 border-slate-700'>{(item.energy).toFixed(2)}</td>
								</tr> 
							)}) 
						}
					</tbody>
				</table>
		</div>
	</div>
	)
}