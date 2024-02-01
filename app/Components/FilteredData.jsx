import { useState, useEffect } from "react"
import Image from "next/image";

export default function FilteredData({ data, exchangeCount, category, handleDropdownClick, onIncreaseCount, onDecreaseCount, resetCategory }) {
	const [filteredData, setFilteredData] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [allData, setAllData] = useState([]);
	const [dropdownOptions, setDropdownOptions] = useState({
		all: 'All Items',
	})

	const tableHeaders = ['Amount', 'Carbohydrates', 'Proteins', 'Fats', 'Energy'];

	useEffect(() => {
		const allItemsCollection = [];
		data.map(item => {
			allItemsCollection.push(item.items);
		});
		setAllData(allItemsCollection);
		getDropdownOptionsData();
	}, [data])

	function getDropdownOptionsData() {
		const updatedOptions = {};
		data.map(item => {
			updatedOptions[item.category.toLowerCase().replaceAll(" ", "_")] = item.category;
		});
		updateDropdownOptions(updatedOptions);
	}

	function updateDropdownOptions(options) {
		setDropdownOptions(prevState => ({
			...prevState,
			...options
		}));
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
		} else if (allData.length) { 
			const uDATA = allData.map(item => {
				return item.map(i => {
					return {...i, 
						quantity: i.quantity + i.default.quantity,
						carbohydrates: i.carbohydrates + i.default.carbohydrates,
						proteins: i.proteins + i.default.proteins,
						fats: (i.fats + i.default.fats),
						energy: i.energy + i.default.energy
					 }
				})
				
			});
			setAllData(uDATA);
		}
		onIncreaseCount();
	}
	
	function handleDecreaseCount() {
		if (filteredData.length) {
			const updatedData = filteredData.map(item => {
				return {...item, 
					quantity: item.quantity - item.default.quantity,
					carbohydrates: item.carbohydrates - item.default.carbohydrates,
					proteins: item.proteins - item.default.proteins,
					fats: item.fats - item.default.fats,
					energy: item.energy - item.default.energy
				}
			});
			setFilteredData(updatedData)
		} else if (allData.length) { 
			const uDATA = allData.map(item => {
				return item.map(i => {
					return {...i, 
						quantity: i.quantity - i.default.quantity,
						carbohydrates: i.carbohydrates - i.default.carbohydrates,
						proteins: i.proteins - i.default.proteins,
						fats: (i.fats - i.default.fats),
						energy: i.energy - i.default.energy
					 }
				})
				
			});
			setAllData(uDATA);
		}
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
			resetCategory('all');
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
						{dropdownOptions[category]}
					</button>
					<ul className="dropdown-menu">
						{ Object.keys(dropdownOptions).map(key => {
							return (
							<li key={key} className="relative">
								<a className="dropdown-item" onClick={() => filterData(`${key}`)} href="#">{dropdownOptions[key]}</a>
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
					<Image src={'icons/illus-exchange-icon.svg'} alt="exchange-illustration" width={18} height={18} /> <span className="mx-2 d-block text-black-50">|</span>
					<button className="btn btn-primary p-0 d-flex align-items-center justify-content-center" style={{width: '24px', height: '25px', fontSize: '19px'}} onClick={() => handleDecreaseCount()} disabled={exchangeCount == 1}>
						-
					</button>
					<span className="d-inline-block fw-medium mx-2">{ String(exchangeCount).padStart(2, '0') }</span>	
					<button className="btn btn-primary p-0 d-flex align-items-center justify-content-center" style={{width: '24px', height: '25px', fontSize: '19px'}} onClick={() => handleIncreaseCount()}>
						+
					</button>
				</div>
			</div>
			<div className={`${filteredData.length > 0 ? 'd-block' : 'd-none'} mt-3 table-wrapper`}>
				<table className="table" style={{minWidth: '980px'}}>
					<thead>
						<tr>
						<th className='text-left px-3 py-1'>Food Item</th>
						<th className='text-center px-3 py-1'> <span>Amount{category !== 'milk_and_milk_products' ? '(g)' : ''}</span> <span className="text-secondary exchange-count-text fs-6 fw-normal">{`${exchangeCount > 1 ? "["+exchangeCount+"x]" : ''}`}</span></th>
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
									<td className='text-center px-3 py-1'>{(item.quantity).toFixed(2)}{item.quantity_unit ? item.quantity_unit : ''}</td>
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
				{ allData.map((item, index) => {
					return (
						<table key={index} className="table mb-5" style={{minWidth: '980px'}}>
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
								{ item.map((i, index) => {
									return (
										<tr key={`${item}_${index}`}>
											<td className='text-left px-3 py-1'>{i.item}</td>
											<td className='text-center px-3 py-1'>{(i.quantity).toFixed(2)}{i.quantity_unit ? i.quantity_unit : ''}</td>
											<td className='text-center px-3 py-1'>{i.carbohydrates ? (i.carbohydrates).toFixed(2) : '--' }</td>
											<td className='text-center px-3 py-1'>{(i.proteins).toFixed(2)}</td>
											<td className='text-center px-3 py-1'>{(i.fats).toFixed(2)}</td>
											<td className='text-center px-3 py-1'>{(i.energy).toFixed(2)}</td>
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