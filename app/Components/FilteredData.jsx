import { useState, useEffect } from "react"
import Image from "next/image";
import { toast, Bounce } from 'react-toastify';

export default function FilteredData({ data, exchangeCount, category, handleDropdownClick, onIncreaseCount, onDecreaseCount, resetCategory }) {
	const [filteredData, setFilteredData] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [allData, setAllData] = useState([]);
	const [copyText, setCopyText] = useState('');
	const [dropdownOptions, setDropdownOptions] = useState({
		all: 'All Items',
	})

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
			setAllData([]);
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

	function handleItemUpdate(item) {
		if (event.key === 'Backspace') {
			return
		}
		const updatedQuantity = Number(event.target.value);
		const itemId = item.id;

		setTimeout(updateItem(itemId, updatedQuantity), 200);
	}

	function updateItem(itemId, updatedQuantity) {
		if (allData.length) {
			const updateItem = allData.map(item => {
				return item.map(i => {
					if (i.id === itemId) {
						const standardValue = updatedQuantity/i.default.quantity;
						return {...i,
							quantity: updatedQuantity,
							carbohydrates: i.default.carbohydrates * standardValue,
							proteins: i.default.proteins * standardValue,
							fats: i.default.fats * standardValue,
							energy: i.default.energy * standardValue
						}
					} else {
						return { ...i }
					}
				})
			});
			setAllData(updateItem);
		} else if (filteredData.length) {
			const updatedItems = filteredData.map(item => {
				if (item.id === itemId) {
					const standardValue = updatedQuantity/item.default.quantity;
					return {...item,
						quantity: updatedQuantity,
						carbohydrates: item.default.carbohydrates * standardValue,
						proteins: item.default.proteins * standardValue,
						fats: item.default.fats * standardValue,
						energy: item.default.energy * standardValue
					}
				} else {
					return { ...item }
				}
			});
			setFilteredData(updatedItems)
		}
	}

	async function handleCopyText(text, event) {
		if (document.querySelector('td.copied')) {
			document.querySelector('td.copied').classList.remove('copied')
		}
		event.currentTarget.classList.add('copied')
		try {
			setCopyText(text)
			const value = Number(text).toFixed(2);

			await navigator.clipboard.writeText(value)
			toast.success('Copied Successfully!', {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: false,
				progress: undefined,
				theme: "light",
				transition: Bounce,
			});

		}
		catch(e) {
			console.error("Failed to copy text", e);
			toast.error('Failed to copy text! Call Shashank :)', {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: false,
				progress: undefined,
				theme: "light",
				transition: Bounce,
			});
		}
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
				<div className="d-flex align-items-center exchange-count-wrapper d-none">
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
						<th className='text-center px-3 py-1'> <span>Amount{category !== 'milk_and_milk_products' ? '(g)' : ''}</span></th>
						<th className='text-center px-3 py-1'>Carbohydrates(g)</th>
						<th className='text-center px-3 py-1'>Proteins(g)</th>
						<th className='text-center px-3 py-1'>Fats(g)</th>
						<th className='text-center px-3 py-1'>Energy(kcal)</th>
						</tr>
					</thead>
					<tbody>
						{ filteredData.map((item, index) => {
							return (
								<tr key={`${item}_${index}`}>
									<td className='text-left px-3 py-1'>{item.item}</td>
									<td className='text-center px-3 py-1'>
										<input className="text-center border-0" type="text" name="filtered-quantity" style={{maxWidth: '80px'}} defaultValue={item.quantity} onKeyUp={() => handleItemUpdate(item)} />
									</td>
									<td className='text-center cursor-pointer px-3 py-1' onClick={(event) => handleCopyText(item.carbohydrates, event)}
									dangerouslySetInnerHTML={{__html: item.carbohydrates ? `<span class="d-flex gap-3 items-center block">
									${(item.carbohydrates).toFixed(2)}
									<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
										<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
									</svg>
								</span>` : '--'}}>
									</td>
									<td className='text-center cursor-pointer px-3 py-1'
										onClick={(event) => handleCopyText(item.proteins, event)}
										dangerouslySetInnerHTML={{
										__html: `<span class="d-flex gap-3 items-center block">
										${(item.proteins).toFixed(2)}
										<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
											<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
										</svg>
									</span>`}}
									></td>
									<td className='text-center cursor-pointer px-3 py-1'
										onClick={(event) => handleCopyText(item.fats, event)}
										dangerouslySetInnerHTML={{
										__html: `<span class="d-flex gap-3 items-center block">
										${(item.fats).toFixed(2)}
										<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
											<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
										</svg>
									</span>`}}
									></td>
									<td className='text-center cursor-pointer px-3 py-1'
										onClick={(event) => handleCopyText(item.energy, event)}
										dangerouslySetInnerHTML={{
										__html: `<span class="d-flex gap-3 items-center block">
										${Math.round(item.energy)}
										<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
											<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
										</svg>
									</span>`}}
									></td>
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
									<th className='text-center px-3 py-1'> <span>Amount(g)</span></th>
									<th className='text-center px-3 py-1'>Carbohydrates(g)</th>
									<th className='text-center px-3 py-1'>Proteins(g)</th>
									<th className='text-center px-3 py-1'>Fats(g)</th>
									<th className='text-center px-3 py-1'>Energy(kcal)</th>
								</tr>
							</thead>
							<tbody>
								{ item.map((i, index) => {
									return (
										<tr key={`${item}_${index}`}>
											<td className='text-left px-3 py-1'>{i.item}</td>
											<td className='text-center px-3 py-1'>
												<input className="text-center border-0" type="text" name="quantity" id="" defaultValue={i.quantity} style={{maxWidth: '80px'}} onKeyUp={() => handleItemUpdate(i)} />
											</td>
											<td className='text-center cursor-pointer px-3 py-1'
												onClick={(event) => handleCopyText(i.carbohydrates, event)}
												dangerouslySetInnerHTML={{__html: i.carbohydrates ? `<span class="d-flex gap-3 items-center block">
													${(i.carbohydrates).toFixed(2)}
													<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
														<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
													</svg>
												</span>` : '--'}}>
											</td>
											<td className='text-center cursor-pointer px-3 py-1'
												onClick={(event) => handleCopyText(i.proteins, event)}
												dangerouslySetInnerHTML={{
													__html: `<span class="d-flex gap-3 items-center block">
													${(i.proteins).toFixed(2)}
													<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
														<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
													</svg>
												</span>`}}></td>
											<td className='text-center cursor-pointer px-3 py-1'
												onClick={(event) => handleCopyText(i.fats, event)}
												dangerouslySetInnerHTML={{
													__html: `<span class="d-flex gap-3 items-center block">
													${(i.fats).toFixed(2)}
													<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
														<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
													</svg>
												</span>`}}></td>
											<td className='text-center cursor-pointer px-3 py-1'
												onClick={(event) => handleCopyText(i.energy, event)}
												dangerouslySetInnerHTML={{
													__html: `<span class="d-flex gap-3 items-center block">
													${Math.round(i.energy)}
													<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M20.9983 10C20.9862 7.82497 20.8897 6.64706 20.1213 5.87868C19.2426 5 17.8284 5 15 5H12C9.17157 5 7.75736 5 6.87868 5.87868C6 6.75736 6 8.17157 6 11V16C6 18.8284 6 20.2426 6.87868 21.1213C7.75736 22 9.17157 22 12 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
														<path d="M3 10V16C3 17.6569 4.34315 19 6 19M18 5C18 3.34315 16.6569 2 15 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3.51839 3.82475 3.22937 4.69989 3.10149 6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
													</svg>
												</span>`}}></td>
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