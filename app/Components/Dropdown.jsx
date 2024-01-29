'use client'

import { useState } from "react"
import FilteredData from "./FilteredData";

export default function Dropdown({props}) {
	const [category, setCategory] = useState("all");
	const [toggleDropdown, setToggleDropdown] = useState(false);
	const [count, setCount] = useState(1)

	function handleDropdownClick(selectedOption) {
		setCategory(selectedOption);
		showDropdownMenu();
		setCount(1)
	}

	function showDropdownMenu() {
		setToggleDropdown((previousToggleDropdown) => {
			return !previousToggleDropdown
		})
	}

	function increaseCount() {
		setCount((previousCount) => previousCount + 1)
	}

	function decreaseCount() {
		setCount((previousCount => previousCount > 0 ? previousCount - 1 : previousCount = 1))
	}

	return (
		<div>
			<FilteredData 
			data={props.data} 
			exchangeCount={count} 
			category={category}
			handleDropdownClick={handleDropdownClick}
			onIncreaseCount={increaseCount}
			onDecreaseCount={decreaseCount}
			showDropdownMenu={showDropdownMenu}
			dropdownToggle={toggleDropdown} />
		</div>
	)
}