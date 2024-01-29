import { useState, useEffect } from "react"
import Image from "next/image";

export default function FilteredData({ data, exchangeCount, category, handleDropdownClick, onIncreaseCount, onDecreaseCount, showDropdownMenu, dropdownToggle }) {
	const [filteredData, setFilteredData] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [allData, setAllData] = useState([]);

	useEffect(() => {
		const allFoodItemsData = [];
		data.map(item => {
			allFoodItemsData.push(item);
		});

		setAllData(allFoodItemsData);
	}, [data])

	const categories = {
		all: "All Items",
		cereals: "Cereals",
		pulses: "Pulses",
		nuts_and_oilseeds: "Nuts & OilSeeds",
		meat_and_poultry: "Meat and Poultry",
		seafood: "Seafood"
	}

	function filterData(category) {
		if (category === 'all') {
			setFilteredData([]);
		} else {
			data.forEach(item => {
				if (item.id === category && category !== 'all') {
					setFilteredData((oldData) => {
						oldData = [];
						return item.items
					})
				}
			});
		}
		
		handleDropdownClick(category);
	}

	function handleIncreaseCount() {
		if (filteredData.length) {
			const updatedData = filteredData.map(item => {
			return {...item, 
				quantity: item.quantity + item.default.quantity,
				carbohydrates: item.carbohydrates + item.default.carbohydrates,
				proteins: item.proteins + item.default.proteins,
				fats: (item.fats + item.default.fats),
				energy: item.energy + item.default.energy }
			});
			setFilteredData(updatedData)
		}
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
		
		if (inputValue.length > 2) {
			setTimeout(() => {
				setFilteredData(searchedData(searchQuery));
			}, 300)
		} else {
			setFilteredData([]);
		}
	}

	function searchedData(query) {
		const tempData = [];

		data.map(item => {
			item.items.filter(it => {
				if (query.length && it.item.includes(query)) {
					tempData.push(it)
				}
			})
		});
		return tempData;
	}

	return (
		<div className="container pt-3" style={{maxWidth: '980px', margin: '0 auto'}}>
			<div className="header-wrapper" style={{minWidth: '980px', margin: '0 auto'}}>
				<div className="dropdown">
					<button className="btn btn-primary dropdown-toggle px-4" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						{categories[category]}
					</button>
					<ul className="dropdown-menu">
						{ Object.keys(categories).map(key => {
							return (
							<li key={key} className="relative">
								<a className="dropdown-item" onClick={() => filterData(`${key}`)} href="#">{categories[key]}</a>
							</li>
							)
						})
						}
					</ul>
				</div>
				<div className="d-flex flex-grow-1 search-wrapper">
					<input type="text" placeholder="Search Food Item..." onChange={handleSearch} className=" border py-1 px-2 rounded w-100" id="search" name="search" />
				</div>
				<div className="d-flex align-items-center exchange-count-wrapper">
					<span className="fw-medium">Exchange:</span>
					<button className="btn" onClick={() => handleDecreaseCount()} disabled={exchangeCount == 1}>
						<Image src={`icons/btn-minus.svg`} alt="decrese-exchange-btn" width={24} height={24} />
					</button>
					<span className="d-inline-block fw-medium mx-1">{ String(exchangeCount).padStart(2, '0') }</span>	
					<button className="btn" onClick={() => handleIncreaseCount()}>
						<Image src={`icons/btn-plus.svg`} alt="increse-exchange-btn" width={24} height={24} />
					</button>
				</div>
			</div>
			<div className={`${filteredData.length > 0 ? 'd-block' : 'd-none'} mt-3 table-wrapper`}>
				<table className="table" style={{minWidth: '980px'}}>
					<thead>
						<tr>
							<th className='text-left px-3 py-1'>Food Item</th>
							<th className='text-center px-3 py-1'> <span>Amount(g)</span> <span className="text-secondary exchange-count-text fs-6 fw-normal">{`${exchangeCount > 1 ? "["+exchangeCount+"x]" : ''}`}</span></th>
							<th className='text-center px-3 py-1'>Carbohydrates(g) <span className="text-secondary exchange-count-text fs-6 fw-normal">{`${exchangeCount > 1 ? "["+exchangeCount+"x]" : ''}`}</span></th>
							<th className='text-center px-3 py-1'>Proteins(g) <span className="text-secondary exchange-count-text fs-6 fw-normal">{`${exchangeCount > 1 ? "["+exchangeCount+"x]" : ''}`}</span></th>
							<th className='text-center px-3 py-1'>Fats(g) <span className="text-secondary exchange-count-text fs-6 fw-normal">{`${exchangeCount > 1 ? "["+exchangeCount+"x]" : ''}`}</span></th>
							<th className='text-center px-3 py-1'>Energy(kcal) <span className="text-secondary exchange-count-text fs-6 fw-normal">{`${exchangeCount > 1 ? "["+exchangeCount+"x]" : ''}`}</span></th>
						</tr>
					</thead>
					<tbody>
						{ filteredData.map((item, index) => {
							return (
								<tr key={`${item}_${index}`}>
									<td className='text-left px-3 py-1'>{item.item}</td>
									<td className='text-center px-3 py-1'>{(item.quantity).toFixed(2)}</td>
									<td className='text-center px-3 py-1'>{item.carbohydrates ? (item.carbohydrates).toFixed(2) : '--' }</td>
									<td className='text-center px-3 py-1'>{(item.proteins).toFixed(2)}</td>
									<td className='text-center px-3 py-1'>{(item.fats).toFixed(2)}</td>
									<td className='text-center px-3 py-1'>{(item.energy).toFixed(2)}</td>
								</tr> 
							)}) 
						}
					</tbody>
				</table>
			</div>
			<div className={`${ !filteredData.length ? 'd-block' : 'd-none'} mt-3 table-wrapper`}>
				{ allData.map(item => {
					return (
						<table key={item.category} className="table mb-5" style={{minWidth: '980px'}}>
							<thead>
								<tr>
									<th className='text-left px-3 py-1'>Food Item</th>
									<th className='text-center px-3 py-1'>Amount(g)</th>
									<th className='text-center px-3 py-1'>Carbohydrates(g)</th>
									<th className='text-center px-3 py-1'>Proteins(g)</th>
									<th className='text-center px-3 py-1'>Fats(g)</th>
									<th className='text-center px-3 py-1'>Energy(kcal)</th>
								</tr>
							</thead>
							<tbody>
								{ item.items.map((item, index) => {
									return (
										<tr key={`${item}_${index}`}>
											<td className='text-left px-3 py-1'>{item.item}</td>
											<td className='text-center px-3 py-1'>{(item.quantity).toFixed(2)}</td>
											<td className='text-center px-3 py-1'>{item.carbohydrates ? (item.carbohydrates).toFixed(2) : '--' }</td>
											<td className='text-center px-3 py-1'>{(item.proteins).toFixed(2)}</td>
											<td className='text-center px-3 py-1'>{(item.fats).toFixed(2)}</td>
											<td className='text-center px-3 py-1'>{(item.energy).toFixed(2)}</td>
										</tr> 
									)}) 
								}
							</tbody>
						</table>
					)
				})}
			</div>
		</div>
	)
}